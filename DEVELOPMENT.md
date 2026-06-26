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
