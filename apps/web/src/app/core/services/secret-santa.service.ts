import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

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

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class SecretSantaService {
  // ── Sinais globais ──────────────────────────────────────────
  private _groups      = signal<Group[]>([]);
  private _participants = signal<Participant[]>([]);
  private _matches     = signal<MatchPair[]>([]);

  groupsSignal()       { return this._groups.asReadonly(); }
  participantsSignal() { return this._participants.asReadonly(); }
  matchesSignal()      { return this._matches.asReadonly(); }

  // ── GROUPS ──────────────────────────────────────────────────
  async loadGroups(): Promise<void> {
    const res = await fetch(`${API}/groups`);
    if (!res.ok) throw new Error('Falha ao carregar grupos');
    this._groups.set(await res.json());
  }

  async createGroup(group: Omit<Group, 'id'>): Promise<Group> {
    const body: Group = { ...group, id: crypto.randomUUID() };
    const res = await fetch(`${API}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Falha ao criar grupo');
    const created: Group = await res.json();
    this._groups.update(prev => [...prev, created]);
    return created;
  }

  async updateGroup(id: string, changes: Partial<Omit<Group, 'id'>>): Promise<void> {
    const current = this._groups().find(g => g.id === id);
    if (!current) throw new Error('Grupo não encontrado');
    const res = await fetch(`${API}/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, ...changes })
    });
    if (!res.ok) throw new Error('Falha ao atualizar grupo');
    const updated: Group = await res.json();
    this._groups.update(prev => prev.map(g => g.id === id ? updated : g));
  }

  async deleteGroup(id: string): Promise<void> {
    const res = await fetch(`${API}/groups/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Falha ao excluir grupo');
    this._groups.update(prev => prev.filter(g => g.id !== id));
    // Remove participantes e matches do grupo excluído localmente
    this._participants.update(prev => prev.filter(p => p.groupId !== id));
    this._matches.update(prev => prev.filter(m => m.groupId !== id));
  }

  // ── PARTICIPANTS ─────────────────────────────────────────────
  async loadParticipants(groupId?: string): Promise<void> {
    const url = groupId
      ? `${API}/participants?groupId=${groupId}`
      : `${API}/participants`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar participantes');
    this._participants.set(await res.json());
  }

  async addParticipant(participant: Participant): Promise<void> {
    const res = await fetch(`${API}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant)
    });
    if (!res.ok) throw new Error('Falha ao adicionar participante');
    const created: Participant = await res.json();
    this._participants.update(prev => [...prev, created]);
  }

  async updateParticipant(id: string, changes: Partial<Omit<Participant, 'id'>>): Promise<void> {
    const current = this._participants().find(p => p.id === id);
    if (!current) throw new Error('Participante não encontrado');
    const res = await fetch(`${API}/participants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...current, ...changes })
    });
    if (!res.ok) throw new Error('Falha ao atualizar participante');
    const updated: Participant = await res.json();
    this._participants.update(prev => prev.map(p => p.id === id ? updated : p));
  }

  async deleteParticipant(id: string): Promise<void> {
    const res = await fetch(`${API}/participants/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Falha ao excluir participante');
    this._participants.update(prev => prev.filter(p => p.id !== id));
  }

  // ── MATCHES ──────────────────────────────────────────────────
  async loadMatches(groupId?: string): Promise<void> {
    const url = groupId
      ? `${API}/matches?groupId=${groupId}`
      : `${API}/matches`;
    const res = await fetch(url);
    if (!res.ok) return;
    this._matches.set(await res.json());
  }

  async saveMatches(pairs: MatchPair[]): Promise<void> {
    for (const pair of pairs) {
      const res = await fetch(`${API}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pair)
      });
      if (!res.ok) throw new Error('Falha ao salvar par');
    }
    await this.loadMatches(pairs[0]?.groupId);
  }

  async clearMatches(groupId: string): Promise<void> {
    const toDelete = this._matches().filter(m => m.groupId === groupId);
    for (const m of toDelete) {
      if (m.id) await fetch(`${API}/matches/${m.id}`, { method: 'DELETE' });
    }
    this._matches.update(prev => prev.filter(m => m.groupId !== groupId));
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
    // 1. Filtra as correspondências (matches) do grupo
    const matches = this._matches().filter(m => m.groupId === grupoId || m.giver.groupId === grupoId);
    
    // 2. Busca o participante correspondente ao usuário logado
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
    
    // O usuário solicitou que o sorteio sempre caia em um participante aleatório
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
    
    // O amigo secreto é o receptor (receiver)
    const receiver = match.receiver;
    
    // Sugestão de lista de desejos baseada no participante
    const wishlists: Record<string, string[]> = {
      'alice': ['Livro de Culinária Francesa', 'Kit de Jardinagem', 'Chocolates Finos'],
      'bob': ['Fone de Ouvido Noise Cancelling', 'Garrafa Térmica Premium', 'Moleskine'],
      'carol': ['Vela Aromática de Lavanda', 'Quadro Decorativo Minimalista', 'Quebra-cabeça 1000 peças'],
      'daniel': ['Mouse Gamer Sem Fio', 'Camiseta de Banda Geek', 'Caneca Térmica'],
      'abe': ['Grãos de Café Especial', 'Livro de Ficção Científica', 'Mini Luminária USB']
    };
    
    const key = receiver.name.toLowerCase().trim();
    const wishlist = wishlists[key] || wishlists[receiver.name.split(' ')[0].toLowerCase()] || ['Vale Presente R$ 100', 'Caixa de Bombons Especial', 'Caneca de Cerâmica'];
    
    // Avatar determinístico baseado no nome
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
