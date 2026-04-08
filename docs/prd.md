# 📄 Product Requirements Document (PRD)

**Projeto:** Gift Hub  
**Versão:** 1.0.0  
**Status:** 🟡 Em Definição (MVP)

## 🎯 1. Visão Geral e Objetivo
O GiftHub é uma plataforma web (PWA) focada em simplificar a organização de Amigos Secretos. O objetivo é eliminar processos manuais (papéis), garantir um sorteio justo e sem erros (alguém tirar a si mesmo), e aumentar o engajamento através de uma interface moderna que centraliza o convite, a lista de desejos, a interação anônima entre os participantes e a recomendação inteligente de presentes.

## 📖 2. Glossário Ubíquo
- Organizador: Usuário que cria o grupo e gerencia as configurações.
- Participante: Usuário que entra no grupo para participar do sorteio.
- Sorteio (Match): O processo algorítmico que define quem presenteia quem.
- Wishlist (Lista de Desejos): Lista de itens ou interesses que o participante deseja ganhar.
- Chat Anônimo: Canal de comunicação onde o "Dador" pode falar com o seu "Recetor" sem revelar sua identidade.
- Sugestor IA: Assistente integrado que analisa o perfil/wishlist do amigo sorteado e o orçamento do grupo para recomendar ideias de presentes.

## 👤 3. Atores e Permissões
Organizador:  Criar, editar e excluir grupos.
- Gerar links de convite.
- Remover participantes indesejados.
- Disparar o sorteio.

Participante Comum:
- Entrar em grupos via link.
- Gerenciar sua própria lista de desejos.
- Visualizar quem tirou no sorteio (após o disparo).
- Participar do chat anônimo.
- Solicitar sugestões de presentes via IA.

## 📝 4. Escopo Funcional (User Stories)
- US01: Como usuário, quero criar um perfil com foto e nome para ser identificado nos grupos.
- US02: Como organizador, quero criar um grupo definindo data da revelação e valor sugerido (orçamento) para orientar os participantes.
- US03: Como organizador, quero um link de convite único para compartilhar via redes sociais.
- US04: Como participante, quero cadastrar minha lista de desejos e interesses para facilitar a escolha do meu amigo secreto.
- US05: Como participante, quero ver quem eu tirei de forma protegida (clique/segure para revelar).
- US06: Como participante, quero enviar mensagens anônimas para quem eu tirei para fazer brincadeiras ou tirar dúvidas sobre o presente.
- US07: Como participante, quero clicar em um botão "Sugerir Presente com IA" na tela do meu sorteado, para receber 3 dicas personalizadas com base na Wishlist dele e no orçamento do grupo.

## 🛡️ 5. Regras de Negócio (Constraints)
- Sistema de pagamento integrado para compra de presentes (ex: carrinho de compras).
- Envio de convites via SMS.
- Logística de entrega de presentes física.
  
## 🚫 6. Fora de Escopo (Non-goals)
- Sistema de pagamento integrado para compra de presentes (ex: carrinho de compras).
- Envio de convites via SMS.
- Logística de entrega de presentes física.

## ⚙️ 7. Requisitos Não Funcionais (Qualidade)
- Mobile-First: A interface deve ser otimizada para smartphones (PWA).
- Segurança (RLS): Um participante nunca deve conseguir descobrir quem o tirou acessando o console ou API (segurança total via Row Level Security no Supabase).
- Performance: O sorteio deve ser processado em menos de 3 segundos para grupos de até 100 pessoas. As respostas da IA devem ter um estado de loading claro (Skeletons/Spinners) para não travar a tela.
- Reatividade: Uso de Angular Signals para atualizações de chat e estados visuais.

## 🛠️ 8. Tech Stack Principal (Diretrizes)
- Frontend: Angular 21+ (Standalone Components).
- Estilização: Tailwind CSS + Spartan UI (HLM).
- Backend/Banco: Supabase (Auth, Database, Realtime).
- Integração Externa (IA): API do Gemini.
- Estado: Angular Signals.
