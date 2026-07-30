# Tennis League API

API REST para gerenciamento de torneios de tênis amadores. Cadastro de usuários, criação de torneios, sorteio automático de confrontos (mata-mata), registro de resultados, histórico de campeões e estatísticas individuais.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 22 |
| Linguagem | TypeScript (strict) |
| Framework | Express 4 |
| ORM | Prisma 6 |
| Banco | PostgreSQL 17 |
| Validação | Zod 4 |
| Autenticação | JWT + bcryptjs |
| Upload | Multer |
| Docs | Swagger (OpenAPI 3.0) |
| Testes | Jest + Supertest |
| Container | Docker + docker-compose |
| Linter | ESLint 9 + Prettier 3 |

## Funcionalidades

- **Autenticação** — Cadastro e login com hash bcrypt (10 rounds) e JWT (7 dias)
- **Perfil** — Atualização de nome, alteração de senha, upload de avatar (JPEG/PNG/WebP, até 2MB)
- **Torneios** — CRUD completo com paginação, validação de dono, controle de status (WAITING → STARTED → FINISHED)
- **Participantes** — Inscrição e saída com validação de limite e duplicidade
- **Sorteio** — Geração automática dos confrontos (Fisher-Yates + pareamento sequencial com suporte a bye)
- **Partidas** — Registro de resultado com avanço automático do vencedor à próxima rodada
- **Histórico** — Torneios finalizados com detalhes de partidas, participantes e campeão
- **Estatísticas** — Torneios jogados/vencidos, partidas jogadas/vencidas, aproveitamento

## Arquitetura

Cada módulo segue o padrão **camadas**:

```
Route (endpoints + OpenAPI)
  → Controller (valida entrada, chama service, responde)
    → Service (regras de negócio, lança AppError)
      → Repository (queries Prisma)
        → Prisma Client → PostgreSQL
```

### Módulos

```
src/
├── config/           # Swagger, Multer
├── modules/
│   ├── auth/         # Cadastro, login
│   ├── users/        # Perfil, avatar, senha
│   ├── tournaments/  # CRUD de torneios
│   ├── participants/ # Inscrição/desistência
│   ├── matches/      # Sorteio, resultados
│   ├── statistics/   # Estatísticas do jogador
│   └── history/      # Histórico de torneios
├── middlewares/       # Auth JWT, error handler
├── shared/           # Prisma client, AppError, configs
├── routes/           # Agregador de rotas
├── app.ts            # Express app
└── server.ts         # Entry point
```

## Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | — | Cadastro |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/users/me` | Sim | Meu perfil |
| PUT | `/api/users/me` | Sim | Atualizar perfil |
| PUT | `/api/users/password` | Sim | Alterar senha |
| POST | `/api/users/avatar` | Sim | Upload avatar |
| GET | `/api/tournaments` | — | Listar torneios |
| POST | `/api/tournaments` | Sim | Criar torneio |
| GET | `/api/tournaments/:id` | — | Detalhes do torneio |
| PUT | `/api/tournaments/:id` | Sim | Editar torneio |
| DELETE | `/api/tournaments/:id` | Sim | Excluir torneio |
| POST | `/api/tournaments/:id/join` | Sim | Inscrever-se |
| DELETE | `/api/tournaments/:id/leave` | Sim | Sair do torneio |
| GET | `/api/tournaments/:id/participants` | — | Listar participantes |
| POST | `/api/tournaments/:id/start` | Sim | Iniciar torneio |
| GET | `/api/tournaments/:id/matches` | — | Partidas do torneio |
| PUT | `/api/matches/:id/result` | Sim | Registrar resultado |
| GET | `/api/statistics/me` | Sim | Minhas estatísticas |
| GET | `/api/history` | — | Histórico de torneios |
| GET | `/api/history/:id` | — | Detalhes do histórico |
| GET | `/api/health` | — | Health check |

## Banco de Dados

### Modelo Relacional

```
users ──1:N──> tournaments (owner)
users ──N:M──> tournaments (via tournament_participants)
users ──1:N──> matches (player_one, player_two, winner)
users ──1:N──> tournament_history (champion)
tournaments ──1:N──> tournament_participants
tournaments ──1:N──> matches
tournaments ──1:1──> tournament_history
```

### Tabelas

- **users** — id (UUID), name, email (UNIQUE), password (bcrypt), avatar?, created_at, updated_at
- **tournaments** — id, owner_id (FK), name, description?, max_players, status (WAITING/STARTED/FINISHED)
- **tournament_participants** — id, tournament_id (FK), user_id (FK), UNIQUE(tournament_id, user_id)
- **matches** — id, tournament_id (FK), player_one_id (FK), player_two_id? (FK, bye), winner_id? (FK), round, status (PENDING/FINISHED)
- **tournament_history** — id, tournament_id (FK, UNIQUE), champion_id (FK), finished_at

## Testes

89 testes, 18 suites, 0 falhas.

| Tipo | Cobertura |
|---|---|
| Statements | 91.07% |
| Branches | 80.15% |
| Functions | 100% |
| Lines | 90.93% |

- Testes unitários de **services** e **controllers** em todos os 7 módulos
- Testes de **middleware** (auth, errorHandler)
- Testes de **integração** (auth, tournaments) com Supertest

## Pré-requisitos

- Node.js >= 22
- Docker + docker-compose
- npm

## Instalação e execução

```bash
# 1. Clone e acesse
git clone <repo-url>
cd tennis_court_api

# 2. Instale dependências
npm install

# 3. Suba o banco PostgreSQL
docker compose up -d

# 4. Configure as variáveis de ambiente
cp .env.example .env

# 5. Gere o Prisma Client e aplique as migrations
npx prisma generate
npx prisma migrate dev

# 6. Inicie o servidor (dev com hot-reload)
npm run dev
```

A API roda em `http://localhost:3000`. Documentação Swagger em `http://localhost:3000/api-docs`.

### Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Desenvolvimento com hot-reload (tsx watch) |
| `npm run build` | Compilar TypeScript |
| `npm start` | Produção (node dist/server.js) |
| `npm test` | Executar testes |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run prisma:studio` | Prisma Studio (interface do banco) |
| `npm run prisma:migrate` | Criar migration |
| `npm run prisma:generate` | Gerar Prisma Client |

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `DATABASE_URL` | `postgresql://admin:admin123@localhost:5432/tennis_db` | Conexão PostgreSQL |
| `PORT` | `3000` | Porta do servidor |
| `JWT_SECRET` | `tennis-league-secret-key...` | Chave de assinatura JWT |
| `JWT_EXPIRES_IN` | `7d` | Tempo de expiração do token |

## Convenções

- **Idioma**: português (código e commits)
- **Arquivos**: kebab-case
- **Rotas**: prefixo `/api`, respostas JSON, erros `{ error, statusCode }`
- **Paginação**: `?page=1&limit=10` → `{ data, total, page, limit }`
- **Commits**: convencionais (feat, fix, refactor, chore)

## Licença

ISC
