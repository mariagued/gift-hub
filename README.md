[![CI - Gift Hub Validation](https://github.com/mariagued/gift-hub/actions/workflows/ci.yml/badge.svg?branch=pipeline)](https://github.com/mariagued/gift-hub/actions/workflows/ci.yml)

# 🎁 GiftHub - O seu Amigo Secreto Descomplicado

## 👥 Identificação/Autores
* **Ane Karine** 
* **Maria Eduarda Guedes** 
* **Mery Helen** 

## 📝 Descrição do projeto
O **GiftHub** é uma aplicação web desenvolvida para organizar grupos de Amigo Secreto de forma simples e segura. O sistema elimina a complexidade dos sorteios de papel garantindo matematicamente que ninguém tire a si mesmo. O escopo abrange a gestão completa do evento, desde a criação do grupo e ingresso via link de convite, até o sorteio automatizado e a troca de mensagens anônimas entre os pares sorteados.

## 📚 Documentação Técnica (Docs)
As definições de produto e arquitetura de software estão detalhadas nos seguintes documentos:
* [📄 Product Requirements Document (PRD)](./docs/prd.md)
* [🛠️ Software Design Document (SDD)](./docs/sdd.md)


## 🎨 Prototipação no Stitch
[🔗 Acessar o protótipo da aplicação](https://stitch.withgoogle.com/preview/4690656891186849666?node-id=3c66de92b3dc43d5b4557582bd47e5b0)

## 🛠️ Stack Tecnológica
* **Frontend:** Angular 21+ (Standalone, Signals)
* **Framework CSS:** Tailwind CSS
* **Biblioteca de UI:** Spartan UI (HLM)
* **BaaS (Backend as a Service):** Supabase (Auth, PostgreSQL)
* **Bibliotecas Adicionais:** lucide-angular (Ícones), date-fns (Datas), zod (Validação).

## 🌐 Link para o site em produção
[🚀 Acessar a aplicação em produção](https://seu-link-aqui)


## RA1 - Design e Experiência do Usuário (UI/UX) com IA
**Competência:** Compreensão de que código sem usabilidade não tem valor. Domínio de ferramentas de IA para acelerar o design (Design-to-Code) com rigor técnico.

- [x] **ID1:** Desenvolver protótipos navegáveis (ex: Stitch/Figma) com foco em diretrizes de usabilidade.
- [x] **ID2:** Projetar interfaces responsivas com abordagem **Mobile-First**.
- [x] **ID3:** Projetar experiência de aplicativo nativo (**PWA**), configurando `manifest.webmanifest` e estados offline.

---

## RA2 - Componentização e UI Declarativa Moderna
**Competência:** Construção de blocos visuais independentes e reutilizáveis utilizando a arquitetura moderna do Angular.

- [x] **ID3:** Desenvolvimento estritamente com **Arquitetura Standalone** (sem NgModules).
- [x] **ID4:** Uso de Frameworks CSS modernos (Tailwind CSS, PrimeNG).
- [x] **ID5:** Aplicação da nova sintaxe de fluxo de controle (`@if` / `@switch`).
- [x] **ID6:** Uso de `@for` com a propriedade `track` obrigatória para performance.
- [x] **ID7:** Aplicação de Pipes para formatação de dados.
- [x] **ID8:** Implementação de **Deferrable Views** (`@defer`) para otimização de carregamento.

---

## RA3 - Reatividade e Gerenciamento de Estado (Signals)
**Competência:** Fluxo de dados reativo e granular, sem manipulação direta do DOM.

- [x] **ID9:** One-way data binding utilizando estritamente **Signals** (`writable` e `computed`).
- [x] **ID10:** Captura de interações via event binding para atualização de estado.
- [x] **ID11:** Two-way data binding utilizando a função moderna `model()`.
- [x] **ID12:** Uso de `effect()` para manipulação de efeitos colaterais reativos.

---

## RA4 - Arquitetura de Software e Injeção de Dependências
**Competência:** Separação de responsabilidades e isolamento da lógica de negócios.

- [x] **ID13:** Comunicação segura e tipada entre componentes via `input()` e `output()`.
- [x] **ID14:** Uso de Services e da função `inject()` para desacoplamento de lógica.

---

## RA5 - Roteamento e Navegação SPA
**Competência:** Criação de navegação fluida, segura e de alta performance.

- [x] **ID15:** Configuração de rotas dinâmicas via API funcional (`provideRouter`).
- [x] **ID16:** Consumo de parâmetros de rota diretamente como `@Input()`.
- [x] **ID17:** Estruturação de rotas aninhadas (child routes).
- [x] **ID18:** Aplicação de **Functional Route Guards** e **Resolvers**.

---

## RA6 - Integração de APIs e Assincronismo (BaaS)
**Competência:** Conexão com o mundo externo, gerenciando requisições e estado assíncrono.

- [x] **ID19:** Requisições assíncronas (GET) a APIs públicas.
- [x] **ID20:** Autenticação e Gestão de Sessão (JWT) com BaaS (ex: Supabase Auth).
- [x] **ID21:** CRUD completo integrado a Backend-as-a-Service.
- [x] **ID22:** Uso de **Functional Interceptors** para tokens globais e tratamento de erros.
- [x] **ID23:** Validações avançadas em Formulários Reativos.
- [x] **ID24:** Integração RxJS + Signals via `toSignal()` e `toObservable()`.

---

## RA7 - Engenharia de Software, Versionamento e DevOps
**Competência:** Gerenciamento de código, colaboração e entrega contínua.

- [x] **ID25:** Gestão de repositório seguindo **Gitflow** (`main` e `develop`).
- [x] **ID26:** Colaboração via Pull Requests e resolução de conflitos.
- [x] **ID27:** Build moderno e deploy automatizado (Vercel/GitHub Pages).

---

## RA8 - Engenharia de Software Assistida por IA
**Competência:** Atuação como Arquiteto de Software utilizando **Spec-Driven Development (SDD)** e orquestração de agentes.

- [x] **ID28:** Gestão Ágil: User Stories e Kanban gerados/geridos com apoio de IA.
- [x] **ID29:** Documentação de Fundações: Diagramas Mermaid (ER) e PRD no README.
- [x] **ID30:** Especificação Técnica: Geração de arquivos `.spec.md` antes do código.
- [x] **ID31:** Orquestração: Configuração de servidores **MCP** e Skills de Angular 20+.
- [x] **ID32:** Validação Técnica: Revisão de código e orientação de IA para Testes Unitários (`.spec.ts`).

-------------------------------------------------------------
## 💻 Instruções de Execução

1. **Clone o repositório:**
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA]
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
Crie o arquivo src/environments/environment.ts:
```bash
export const environment = {
  production: false,
  supabaseUrl: 'SUA_URL_DO_SUPABASE',
  supabaseKey: 'SUA_CHAVE_PUBLICA_DO_SUPABASE'
};
```

4. **Execute o projeto:**
```bash
ng serve
```
Acesse: http://localhost:4200/


## 📱 Telas da Aplicação


