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


## 🎨 Prototipação no Figma
[🔗 Acessar o protótipo no Figma](https://link-do-seu-figma)

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

- [ ] **ID1:** Desenvolver protótipos navegáveis (ex: Stitch/Figma) com foco em diretrizes de usabilidade.
- [ ] **ID2:** Projetar interfaces responsivas com abordagem **Mobile-First**.
- [ ] **ID3:** Projetar experiência de aplicativo nativo (**PWA**), configurando `manifest.webmanifest` e estados offline.

---

## RA2 - Componentização e UI Declarativa Moderna
**Competência:** Construção de blocos visuais independentes e reutilizáveis utilizando a arquitetura moderna do Angular.

- [ ] **ID3:** Desenvolvimento estritamente com **Arquitetura Standalone** (sem NgModules).
- [ ] **ID4:** Uso de Frameworks CSS modernos (Tailwind CSS, PrimeNG).
- [ ] **ID5:** Aplicação da nova sintaxe de fluxo de controle (`@if` / `@switch`).
- [ ] **ID6:** Uso de `@for` com a propriedade `track` obrigatória para performance.
- [ ] **ID7:** Aplicação de Pipes para formatação de dados.
- [ ] **ID8:** Implementação de **Deferrable Views** (`@defer`) para otimização de carregamento.

---

## RA3 - Reatividade e Gerenciamento de Estado (Signals)
**Competência:** Fluxo de dados reativo e granular, sem manipulação direta do DOM.

- [ ] **ID9:** One-way data binding utilizando estritamente **Signals** (`writable` e `computed`).
- [ ] **ID10:** Captura de interações via event binding para atualização de estado.
- [ ] **ID11:** Two-way data binding utilizando a função moderna `model()`.
- [ ] **ID12:** Uso de `effect()` para manipulação de efeitos colaterais reativos.

---

## RA4 - Arquitetura de Software e Injeção de Dependências
**Competência:** Separação de responsabilidades e isolamento da lógica de negócios.

- [ ] **ID13:** Comunicação segura e tipada entre componentes via `input()` e `output()`.
- [ ] **ID14:** Uso de Services e da função `inject()` para desacoplamento de lógica.

---

## RA5 - Roteamento e Navegação SPA
**Competência:** Criação de navegação fluida, segura e de alta performance.

- [ ] **ID15:** Configuração de rotas dinâmicas via API funcional (`provideRouter`).
- [ ] **ID16:** Consumo de parâmetros de rota diretamente como `@Input()`.
- [ ] **ID17:** Estruturação de rotas aninhadas (child routes).
- [ ] **ID18:** Aplicação de **Functional Route Guards** e **Resolvers**.

---

## RA6 - Integração de APIs e Assincronismo (BaaS)
**Competência:** Conexão com o mundo externo, gerenciando requisições e estado assíncrono.

- [ ] **ID19:** Requisições assíncronas (GET) a APIs públicas.
- [ ] **ID20:** Autenticação e Gestão de Sessão (JWT) com BaaS (ex: Supabase Auth).
- [ ] **ID21:** CRUD completo integrado a Backend-as-a-Service.
- [ ] **ID22:** Uso de **Functional Interceptors** para tokens globais e tratamento de erros.
- [ ] **ID23:** Validações avançadas em Formulários Reativos.
- [ ] **ID24:** Integração RxJS + Signals via `toSignal()` e `toObservable()`.

---

## RA7 - Engenharia de Software, Versionamento e DevOps
**Competência:** Gerenciamento de código, colaboração e entrega contínua.

- [ ] **ID25:** Gestão de repositório seguindo **Gitflow** (`main` e `develop`).
- [ ] **ID26:** Colaboração via Pull Requests e resolução de conflitos.
- [ ] **ID27:** Build moderno e deploy automatizado (Vercel/GitHub Pages).

---

## RA8 - Engenharia de Software Assistida por IA
**Competência:** Atuação como Arquiteto de Software utilizando **Spec-Driven Development (SDD)** e orquestração de agentes.

- [ ] **ID28:** Gestão Ágil: User Stories e Kanban gerados/geridos com apoio de IA.
- [ ] **ID29:** Documentação de Fundações: Diagramas Mermaid (ER) e PRD no README.
- [ ] **ID30:** Especificação Técnica: Geração de arquivos `.spec.md` antes do código.
- [ ] **ID31:** Orquestração: Configuração de servidores **MCP** e Skills de Angular 20+.
- [ ] **ID32:** Validação Técnica: Revisão de código e orientação de IA para Testes Unitários (`.spec.ts`).

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
(Adicione aqui as imagens ou GIFs do seu projeto em funcionamento).
