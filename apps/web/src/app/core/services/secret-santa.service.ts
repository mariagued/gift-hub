import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Group {
  id: string;
  name: string;
  drawDate: string;
  budgetLimit?: number;
  status: 'Pendente' | 'Ativo' | 'Concluido';
}

export interface Participant {
  id: string;
  name: string;
  email?: string;
  groupId: string;
}

export interface MatchPair {
  id?: string;
  groupId?: string;
  giver: Participant;
  receiver: Participant;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  wishlist: string[];
}

@Injectable({ providedIn: 'root' })
export class SecretSantaService {
  private supabaseService = inject(SupabaseService);

  // ── Sinais globais ──────────────────────────────────────────
  private _groups      = signal<Group[]>([]);
  private _participants = signal<Participant[]>([]);
  private _matches     = signal<MatchPair[]>([]);

  groupsSignal()       { return this._groups.asReadonly(); }
  participantsSignal() { return this._participants.asReadonly(); }
  matchesSignal()      { return this._matches.asReadonly(); }

  // ── GROUPS ──────────────────────────────────────────────────
  async loadGroups(): Promise<void> {
    const { data: groupsData, error: groupsError } = await this.supabaseService.client
      .from('GROUP')
      .select('*');
    if (groupsError) throw groupsError;

    const { data: drawsData, error: drawsError } = await this.supabaseService.client
      .from('DRAW')
      .select('groupId');
    if (drawsError) throw drawsError;

    const { data: partsData, error: partsError } = await this.supabaseService.client
      .from('PARTICIPANT')
      .select('groupId');
    if (partsError) throw partsError;

    const drawnGroupIds = new Set((drawsData || []).map(d => d.groupId));

    const partCounts: Record<string, number> = {};
    for (const p of partsData || []) {
      partCounts[p.groupId] = (partCounts[p.groupId] || 0) + 1;
    }

    const mapped: Group[] = (groupsData || []).map(g => {
      const count = partCounts[g.id] || 0;
      let status: 'Pendente' | 'Ativo' | 'Concluido' = 'Pendente';
      if (drawnGroupIds.has(g.id)) {
        status = 'Concluido';
      } else if (count >= 3) {
        status = 'Ativo';
      }

      return {
        id: g.id,
        name: g.name,
        drawDate: g.eventDate,
        budgetLimit: g.budgetLimit ? parseFloat(g.budgetLimit) : undefined,
        status
      };
    });

    this._groups.set(mapped);
  }

  async createGroup(group: Omit<Group, 'id' | 'status'>): Promise<Group> {
    const id = crypto.randomUUID();
    const { error } = await this.supabaseService.client
      .from('GROUP')
      .insert({
        id,
        name: group.name,
        eventDate: group.drawDate,
        budgetLimit: group.budgetLimit
      });
    if (error) throw error;

    const created: Group = {
      id,
      name: group.name,
      drawDate: group.drawDate,
      budgetLimit: group.budgetLimit,
      status: 'Pendente'
    };

    // Auto-add creator as ADMIN of the group
    const loggedIn = localStorage.getItem('currentUser');
    if (loggedIn) {
      try {
        const userObj = JSON.parse(loggedIn);
        if (userObj.id) {
          await this.supabaseService.client
            .from('PARTICIPANT')
            .insert({
              id: crypto.randomUUID(),
              groupId: id,
              userId: userObj.id,
              role: 'ADMIN'
            });
        }
      } catch (e) {
        // Ignorar falha no auto-add do criador
      }
    }

    this._groups.update(prev => [...prev, created]);
    return created;
  }

  async updateGroup(id: string, changes: Partial<Omit<Group, 'id'>>): Promise<void> {
    const updateData: any = {};
    if (changes.name !== undefined) updateData.name = changes.name;
    if (changes.drawDate !== undefined) updateData.eventDate = changes.drawDate;
    if (changes.budgetLimit !== undefined) updateData.budgetLimit = changes.budgetLimit;

    const { error } = await this.supabaseService.client
      .from('GROUP')
      .update(updateData)
      .eq('id', id);
    if (error) throw error;

    this._groups.update(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g,
          name: changes.name !== undefined ? changes.name : g.name,
          drawDate: changes.drawDate !== undefined ? changes.drawDate : g.drawDate,
          budgetLimit: changes.budgetLimit !== undefined ? changes.budgetLimit : g.budgetLimit
        };
      }
      return g;
    }));
  }

  async deleteGroup(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('GROUP')
      .delete()
      .eq('id', id);
    if (error) throw error;

    this._groups.update(prev => prev.filter(g => g.id !== id));
    this._participants.update(prev => prev.filter(p => p.groupId !== id));
    this._matches.update(prev => prev.filter(m => m.groupId !== id));
  }

  // ── PARTICIPANTS ─────────────────────────────────────────────
  async loadParticipants(groupId?: string): Promise<void> {
    let query = this.supabaseService.client
      .from('PARTICIPANT')
      .select(`
        id,
        groupId,
        user:USER!userId(name, email)
      `);

    if (groupId) {
      query = query.eq('groupId', groupId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const mapped: Participant[] = (data || []).map(p => ({
      id: p.id,
      name: (p.user as any)?.name || 'Desconhecido',
      email: (p.user as any)?.email,
      groupId: p.groupId
    }));

    this._participants.set(mapped);
  }

  async addParticipant(participant: Participant): Promise<void> {
    const email = participant.email || `${participant.name.toLowerCase().replace(/\s+/g, '')}@example.com`;

    // 1. Find or create the USER
    let userId: string;
    const { data: userData, error: userError } = await this.supabaseService.client
      .from('USER')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) throw userError;

    if (userData) {
      userId = userData.id;
    } else {
      const newUserId = crypto.randomUUID();
      const { error: insertUserError } = await this.supabaseService.client
        .from('USER')
        .insert({
          id: newUserId,
          email,
          name: participant.name,
          avatarUrl: `https://i.pravatar.cc/150?u=${newUserId}`
        });
      if (insertUserError) throw insertUserError;
      userId = newUserId;
    }

    // 2. Insert PARTICIPANT
    const newParticipantId = crypto.randomUUID();
    const { error: partError } = await this.supabaseService.client
      .from('PARTICIPANT')
      .insert({
        id: newParticipantId,
        groupId: participant.groupId,
        userId,
        role: 'MEMBER'
      });

    if (partError) throw partError;

    const created: Participant = {
      id: newParticipantId,
      name: participant.name,
      email,
      groupId: participant.groupId
    };
    this._participants.update(prev => [...prev, created]);
  }

  async updateParticipant(id: string, changes: Partial<Omit<Participant, 'id'>>): Promise<void> {
    // 1. Get participant's userId
    const { data: partData, error: partError } = await this.supabaseService.client
      .from('PARTICIPANT')
      .select('userId')
      .eq('id', id)
      .single();
    if (partError) throw partError;

    // 2. Update USER if name/email changed
    const userChanges: any = {};
    if (changes.name) userChanges.name = changes.name;
    if (changes.email) userChanges.email = changes.email;

    if (Object.keys(userChanges).length > 0) {
      const { error: userError } = await this.supabaseService.client
        .from('USER')
        .update(userChanges)
        .eq('id', partData.userId);
      if (userError) throw userError;
    }

    this._participants.update(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          name: changes.name || p.name,
          email: changes.email || p.email
        };
      }
      return p;
    }));
  }

  async deleteParticipant(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('PARTICIPANT')
      .delete()
      .eq('id', id);
    if (error) throw error;

    this._participants.update(prev => prev.filter(p => p.id !== id));
  }

  // ── MATCHES ──────────────────────────────────────────────────
  async loadMatches(groupId?: string): Promise<void> {
    let query = this.supabaseService.client
      .from('PAIR')
      .select(`
        id,
        draw:DRAW!inner(id, groupId),
        giver:PARTICIPANT!giverId(
          id,
          groupId,
          user:USER!userId(id, name, email)
        ),
        receiver:PARTICIPANT!receiverId(
          id,
          groupId,
          user:USER!userId(id, name, email)
        )
      `);

    if (groupId) {
      query = query.eq('draw.groupId', groupId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error loading matches:', error);
      return;
    }

    const mapped: MatchPair[] = (data || []).map(p => ({
      id: p.id,
      groupId: (p.draw as any).groupId,
      giver: {
        id: (p.giver as any).id,
        name: (p.giver as any).user.name,
        email: (p.giver as any).user.email,
        groupId: (p.giver as any).groupId
      },
      receiver: {
        id: (p.receiver as any).id,
        name: (p.receiver as any).user.name,
        email: (p.receiver as any).user.email,
        groupId: (p.receiver as any).groupId
      }
    }));

    this._matches.set(mapped);
  }

  async saveMatches(pairs: MatchPair[]): Promise<void> {
    if (pairs.length === 0) return;
    const groupId = pairs[0].groupId;
    if (!groupId) throw new Error('Grupo inválido para sorteio');

    // 1. Create a DRAW
    const drawId = crypto.randomUUID();
    const { error: drawError } = await this.supabaseService.client
      .from('DRAW')
      .insert({
        id: drawId,
        groupId
      });
    if (drawError) throw drawError;

    // 2. Insert all PAIRs
    const pairInserts = pairs.map(p => ({
      id: crypto.randomUUID(),
      drawId,
      giverId: p.giver.id,
      receiverId: p.receiver.id
    }));

    const { error: pairsError } = await this.supabaseService.client
      .from('PAIR')
      .insert(pairInserts);
    if (pairsError) throw pairsError;

    await this.loadMatches(groupId);
    await this.loadGroups();
  }

  async clearMatches(groupId: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('DRAW')
      .delete()
      .eq('groupId', groupId);
    if (error) throw error;

    this._matches.update(prev => prev.filter(m => m.groupId !== groupId));
    await this.loadGroups();
  }

  // ── SORTEIO ──────────────────────────────────────────────────
  generateMatches(participants: Participant[], groupId: string): MatchPair[] {
    if (participants.length < 3) {
      throw new Error('São necessários ao menos 3 participantes para o sorteio.');
    }
    const shuffled = this.shuffleArray([...participants]);
    return shuffled.map((giver, i) => ({
      id: crypto.randomUUID(),
      groupId,
      giver,
      receiver: shuffled[(i + 1) % shuffled.length]
    }));
  }

  /** Revelação individual */
  getMeuAmigoSorteado(grupoId: string): User {
    const matches = this._matches().filter(m => m.groupId === grupoId);

    let loggedInEmail = 'maria.guedes@gifthub.test';
    let loggedInName = 'Maria Guedes';

    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.email) loggedInEmail = user.email;
        if (user.name) loggedInName = user.name;
      } catch (e) {
        // Fallback
      }
    }

    let match: MatchPair | undefined;

    // O sorteio sempre cai em um participante aleatório (mantendo a lógica original)
    if (matches.length > 0) {
      const randomIndex = Math.floor(Math.random() * matches.length);
      match = matches[randomIndex];
    }

    if (!match) {
      return {
        id: 'no-match',
        name: 'Nenhum sorteio realizado',
        avatarUrl: '',
        wishlist: []
      };
    }

    const receiver = match.receiver;

    const wishlists: Record<string, string[]> = {
      'alice': ['Livro de Culinária Francesa', 'Kit de Jardinagem', 'Chocolates Finos'],
      'bob': ['Fone de Ouvido Noise Cancelling', 'Garrafa Térmica Premium', 'Moleskine'],
      'carol': ['Vela Aromática de Lavanda', 'Quadro Decorativo Minimalista', 'Quebra-cabeça 1000 peças'],
      'daniel': ['Mouse Gamer Sem Fio', 'Camiseta de Banda Geek', 'Caneca Térmica'],
      'abe': ['Grãos de Café Especial', 'Livro de Ficção Científica', 'Mini Luminária USB']
    };

    const key = receiver.name.toLowerCase().trim();
    const wishlist = wishlists[key] || wishlists[receiver.name.split(' ')[0].toLowerCase()] || ['Vale Presente R$ 100', 'Caixa de Bombons Especial', 'Caneca de Cerâmica'];

    const nameSum = receiver.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const avatarImgId = (nameSum % 70) + 1;

    return {
      id: receiver.id,
      name: receiver.name,
      avatarUrl: `https://i.pravatar.cc/150?img=${avatarImgId}`,
      wishlist
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    let ci = array.length;
    while (ci > 0) {
      const ri = Math.floor(Math.random() * ci--);
      [array[ci], array[ri]] = [array[ri], array[ci]];
    }
    return array;
  }
}
