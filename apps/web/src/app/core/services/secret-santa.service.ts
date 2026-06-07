import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  wishlist: string[];
}

export interface Participant {
  id: string;
  name: string;
  email?: string;
  previousSantas?: string[]; // Arrays de IDs que essa pessoa já tirou antes (para evitar repetição no futuro!)
}

export interface MatchPair {
  giver: Participant; // Dador
  receiver: Participant; // Recetor
}

@Injectable({
  providedIn: 'root'
})
export class SecretSantaService {

  constructor() { }

  /**
   * Retorna os dados do amigo sorteado de forma mockada.
   */
  getMeuAmigoSorteado(grupoId: string): User {
    return {
      id: 'mock-123',
      name: 'João Pedro',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      wishlist: ['Cafeteira Nespresso', 'Livro O Senhor dos Anéis', 'Vinho Seco']
    };
  }

  /**
   * Realiza o sorteio de Amigo Secreto.
   * Regras matemáticas aplicadas:
   * 1. A pessoa não pode se sortear (Giver.id !== Receiver.id).
   * 2. Se preventMutual for true, duas pessoas não podem se tirar mutuamente (A tira B e B tira A).
   * 
   * @param participants Lista de participantes do grupo
   * @param preventMutual Bloqueia sorteio cruzado
   * @returns Lista de pares Sorteados ou Lança Error se for impossível.
   */
  generateMatches(participants: Participant[], preventMutual: boolean = false): MatchPair[] {
    if (!participants || participants.length < 3) {
      throw new Error('Para um sorteio de Amigo Secreto viável, é necessário no mínimo 3 participantes.');
    }

    const shuffled = this.shuffleArray([...participants]);
    const matches: MatchPair[] = [];

    // Lógica eficiente: Um anel de deslocamento (Circular Shift)
    // Se temos A, B, C, D: (A tira B), (B tira C), (C tira D), (D tira A).
    // Isso garante nativamente que a pessoa não tira ela mesma, 
    // E garante que ninguém fica sem presente ou sem receber.
    // E se lenght > 2, nativamente também já evita o preventMutual.
    
    for (let i = 0; i < shuffled.length; i++) {
        const giver = shuffled[i];
        // O recebedor é o próximo na fila embaralhada. O último da fila tira o primeiro.
        const receiver = shuffled[(i + 1) % shuffled.length];
        
        matches.push({
          giver,
          receiver
        });
    }

    // Validação extra por segurança (embora o algoritmo circular acima garanta 100% essas duas regras):
    const isValid = matches.every(m => {
        const safeSelfDraw = m.giver.id !== m.receiver.id;
        const safeMutualDraw = preventMutual 
          ? !matches.find(mx => mx.giver.id === m.receiver.id && mx.receiver.id === m.giver.id)
          : true;

        return safeSelfDraw && safeMutualDraw;
    });

    if (!isValid) {
       // Quase impossível com o método Circular Shift em arrays > 2, mas fica como fallback de sanidade
       throw new Error('O sorteio gerou pares inválidos. Tente novamente.');
    }

    return matches;
  }

  /**
   * Função utilitária de embaralhamento de Array (Fisher-Yates)
   */
  private shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
