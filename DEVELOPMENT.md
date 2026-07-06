# Development Log

## Sprint 1 — Autenticação

### Criado
- `src/modules/auth/` — Módulo completo de autenticação
  - `dto/register.dto.ts` — Schema Zod para cadastro
  - `dto/login.dto.ts` — Schema Zod para login
  - `auth.controller.ts` — Handlers register e login
  - `auth.service.ts` — Regras de negócio (bcrypt hash/compare, geração JWT)
  - `auth.repository.ts` — Acesso Prisma (findByEmail, create)
  - `auth.routes.ts` — Rotas POST /register e POST /login + Swagger
- `src/middlewares/auth.middleware.ts` — Middleware de autenticação JWT
- `src/shared/config.ts` — Funções compartilhadas getJwtSecret e getJwtExpiresIn

### Modificado
- `src/routes/index.ts` — Adicionado authRoutes
- `src/config/swagger.ts` — Adicionado securitySchemes bearerAuth
- `src/shared/errors/AppError.ts` — Passou a estender Error (correção crítica)
- `.env` / `.env.example` — Adicionado JWT_SECRET e JWT_EXPIRES_IN

### Dependências instaladas
- bcryptjs, jsonwebtoken, zod (produção)
- @types/bcryptjs, @types/jsonwebtoken (desenvolvimento)

### Endpoints
| Método | Rota | Descrição |
|---|---|---|
| POST | /api/auth/register | Cadastro de usuário |
| POST | /api/auth/login | Login e retorno de JWT |

---

## Sprint 2 — Gerenciamento de Perfil

### Criado
- `src/modules/users/` — Módulo completo de perfil do usuário
  - `dto/update-profile.dto.ts` — Schema Zod para atualização de perfil
  - `dto/change-password.dto.ts` — Schema Zod para alteração de senha
  - `users.controller.ts` — Handlers getMe, updateMe, changePassword, uploadAvatar
  - `users.service.ts` — Regras de negócio (validação de senha, hash, avatar)
  - `users.repository.ts` — Acesso Prisma (findById, update, updatePassword)
  - `users.routes.ts` — Rotas + Swagger
- `src/config/multer.ts` — Configuração do Multer para upload de avatares
- `uploads/` — Diretório para armazenamento local de avatares

### Modificado
- `src/routes/index.ts` — Adicionado usersRoutes com authMiddleware
- `src/app.ts` — Adicionado static serving para /uploads
- `.gitignore` — Adicionado uploads/
- `CONTEXT.md` — Atualizado com tecnologias e regras de usuário

### Dependências instaladas
- multer (produção)
- @types/multer (desenvolvimento)

### Endpoints
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | /api/users/me | Sim | Retorna perfil do usuário autenticado |
| PUT | /api/users/me | Sim | Atualiza nome do perfil |
| PUT | /api/users/password | Sim | Altera a senha |
| POST | /api/users/avatar | Sim | Upload de avatar |

---

## Sprint 3 — CRUD de Torneios

### Criado
- `src/modules/tournaments/` — Módulo completo de torneios
  - `dto/create-tournament.dto.ts` — Schema Zod para criação
  - `dto/update-tournament.dto.ts` — Schema Zod para atualização
  - `tournaments.controller.ts` — Handlers create, findAll, findById, update, remove
  - `tournaments.service.ts` — Regras de negócio (validação de dono, status WAITING)
  - `tournaments.repository.ts` — Acesso Prisma (CRUD + paginação + contagem)
  - `tournaments.routes.ts` — Rotas + Swagger

### Modificado
- `src/routes/index.ts` — Adicionado tournamentsRoutes

### Endpoints
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | /api/tournaments | Sim | Criar torneio |
| GET | /api/tournaments | Não | Listar torneios (paginado) |
| GET | /api/tournaments/:id | Não | Buscar torneio por ID |
| PUT | /api/tournaments/:id | Sim | Editar torneio (apenas dono) |
| DELETE | /api/tournaments/:id | Sim | Excluir torneio (apenas dono) |

---

## Sprint 4 — Participantes

### Criado
- `src/modules/participants/` — Módulo completo de participantes
  - `participants.controller.ts` — Handlers join, leave, listParticipants
  - `participants.service.ts` — Regras de negócio (limite de jogadores, duplicidade, status WAITING)
  - `participants.repository.ts` — Acesso Prisma (create, findByTournamentAndUser, countByTournament, findParticipantsByTournament, delete)
  - `participants.routes.ts` — Rotas + Swagger

### Modificado
- `src/routes/index.ts` — Adicionado participantsRoutes montado em /tournaments

### Endpoints
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | /api/tournaments/:id/join | Sim | Inscrever usuário no torneio |
| DELETE | /api/tournaments/:id/leave | Sim | Sair do torneio |
| GET | /api/tournaments/:id/participants | Não | Listar participantes do torneio |

---

## Sprint 5 — Sorteio dos Confrontos

### Criado
- `src/modules/matches/` — Módulo de partidas (sorteio e gerenciamento)
  - `matches.repository.ts` — Acesso Prisma (createMany)
  - `matches.service.ts` — Lógica de embaralhamento, pareamento e bye
  - `matches.controller.ts` — Handler startTournament
  - `matches.routes.ts` — Rota + Swagger

### Modificado
- `src/modules/tournaments/tournaments.repository.ts` — Adicionado updateStatus
- `src/modules/participants/participants.repository.ts` — Adicionado findUserIdsByTournament
- `src/routes/index.ts` — Adicionado matchesRoutes montado em /tournaments

### Endpoints
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | /api/tournaments/:id/start | Sim | Iniciar torneio e gerar chaveamento |

### Regras implementadas
- Apenas o dono pode iniciar
- Torneio precisa estar WAITING
- Mínimo de 2 participantes
- Embaralha participantes aleatoriamente
- Gera pares [0x1, 2x3, ...]
- Número ímpar: último jogador avança com bye (playerTwo = null)
- Atualiza status para STARTED

---

## Sprint 6 — Gestão das Partidas

### Modificado
- `src/modules/matches/` — Expandido com gestão de partidas
  - `matches.repository.ts` — Adicionado: findAllByTournament, findById, findByRound, updateResult, updatePlayerOne, updatePlayerTwo, countPendingByTournament, createHistory, create (individual), createMany sequencial
  - `matches.service.ts` — Adicionado: listMatches, registerResult com avanço automático de vencedor e finalização do torneio
  - `matches.controller.ts` — Adicionado: listMatches, registerResult
  - `matches.routes.ts` — Adicionado: GET /:id/matches, PUT /:id/result + Swagger
- `src/routes/index.ts` — Adicionado matchesResultRoutes montado em /matches

### Endpoints
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | /api/tournaments/:id/matches | Não | Listar partidas do torneio |
| PUT | /api/matches/:id/result | Sim | Registrar vencedor e avançar |

### Regras implementadas
- Apenas o dono do torneio pode registrar resultado
- Partida deve estar PENDING
- Vencedor deve ser um dos jogadores da partida
- Vencedor avança automaticamente para a próxima rodada
- Partida par (even) cria confronto da próxima rodada como player_one
- Partida ímpar (odd) preenche player_two do confronto já criado
- Quando resta 0 partidas PENDING → torneio finalizado com campeão registrado em tournament_history
