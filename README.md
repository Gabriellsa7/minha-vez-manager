<div align="center">

<!-- IMG: logo do manager (ex: src/assets/img/logo) -->

# Minha Vez — Manager

**O painel de controle das unidades de saúde.**

Aplicação web usada pelas unidades de saúde para gerenciar profissionais, exames, horários e acompanhar a fila de atendimento em tempo real.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)

<!-- IMG: print do dashboard principal -->
</div>

---

## Sobre o projeto

O **minha-vez-manager** é o painel administrativo do ecossistema Minha Vez, um sistema de gestão de filas para unidades de saúde:

| Repositório | Papel |
|---|---|
| 🖥️ **minha-vez-manager** (este repo) | Painel web usado pelas unidades de saúde |
| 📱 [minha-vez-app](../minha-vez-app) | App mobile usado pelos pacientes |
| ⚙️ [minhavez-backend](../minhavez-backend) | API central — filas, agendamentos, notificações e autenticação |

Enquanto o app mobile é usado pelo **paciente** para agendar e acompanhar sua vez, o Manager é usado pela **equipe da unidade de saúde** para configurar profissionais, exames disponíveis, horários e conduzir a fila do dia a dia.

## ✨ Funcionalidades

- 🔐 **Login** de administradores/profissionais da unidade
- 🏥 **Gestão da unidade de saúde**: dados, horários de funcionamento
- 👨‍⚕️ **Gestão de profissionais**: cadastro, histórico e vínculo com exames
- 🩺 **Gestão de exames**: cadastro, disponibilidade e ofertas por profissional
- 📄 **Upload de exames** (documentos/PDFs dos profissionais)
- 📅 **Agendamentos**: acompanhamento das reservas de exames
- 📊 **Gestão de fila**: acompanhamento e histórico de atendimentos em tempo real
- 👤 **Perfil profissional** com histórico de atendimentos
- 🌗 **Tema claro/escuro**

<!-- IMG: grid de prints (fila em andamento, cadastro de profissional, agenda de exames) -->

## 🧱 Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como build tool
- [React Router](https://reactrouter.com/) para roteamento
- [TanStack Query](https://tanstack.com/query) para cache e sincronização com a API
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para formulários e validação
- [Axios](https://axios-http.com/) para consumo da API
- [date-fns](https://date-fns.org/) + [react-day-picker](https://daypicker.dev/) para datas e agendas
- [react-toastify](https://fkhadra.github.io/react-toastify/) para notificações em tela
- Sass para estilização

## 📂 Estrutura do projeto

```
src/
├── components/    # Componentes de UI reutilizáveis (sidebar, header, modais, etc.)
├── features/      # Features por domínio (auth, profissionais, exames, filas...)
├── routes/        # Definição de rotas da aplicação
├── services/      # Cliente axios e configuração do React Query
├── config/        # Entidades, constantes e variáveis de ambiente
├── hooks/         # Hooks compartilhados
└── assets/        # Imagens e SVGs
```

## 🚀 Rodando localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- API do [minhavez-backend](../minhavez-backend) rodando (local ou remota)

### Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
```

```env
VITE_API_URL=https://sua-api.com
```

```bash
# 3. Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (Vite) |
| `npm run build` | Compila a aplicação para produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o ESLint |

---

<div align="center">
  Feito com 💙 por <a href="https://github.com/Gabriellsa7">Gabriel Santana</a>
</div>
