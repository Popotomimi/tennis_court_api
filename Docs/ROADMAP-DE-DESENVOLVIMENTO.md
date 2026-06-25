Sprint 0:

Setup do Projeto

Objetivo:

Criar estrutura base.

Tarefas:

Infra
Criar projeto Node
Configurar Typescript
Configurar ESLint
Configurar Prettier
Banco
PostgreSQL
Prisma
Docker
docker-compose
postgres
Estrutura
MVC
Modules
Documentação
Swagger

Entrega:

API rodando
Banco conectado
Swagger funcionando

---

Sprint 1:

Autenticação

Objetivo:

Usuário conseguir criar conta e autenticar.

Endpoints:
POST /auth/register
POST /auth/login

Implementar:

- Cadastro
  validar email
  hash bcrypt
- Login
  validar senha
  gerar JWT

Middleware:
AuthMiddleware

Entrega:

Usuário autenticado
JWT funcionando

---

Sprint 2
Usuário

Objetivo:

Gerenciar perfil.

Endpoints:
GET /users/me
PUT /users/me
PUT /users/password
POST /users/avatar

Implementar:

Perfil
editar nome
editar email
Senha
senha atual
nova senha
Avatar
upload local

Entrega:
Perfil completo

---

Sprint 3
Torneios

Objetivo:

Criar torneios.

Endpoints:
POST /tournaments
GET /tournaments
GET /tournaments/:id
PUT /tournaments/:id
DELETE /tournaments/:id

Regras:

dono do torneio
max participantes

Entrega:
CRUD completo

---

Sprint 4
Participantes

Objetivo:

Entrar e sair do torneio.

Endpoints:
POST /tournaments/:id/join
DELETE /tournaments/:id/leave
GET /tournaments/:id/participants

Regras:

Não permitir
usuário duplicado
torneio iniciado
Validar
limite de jogadores

Entrega:
Participantes funcionando

---

Sprint 5
Sorteio dos Confrontos

Objetivo:

Gerar chaveamento automático.

Endpoint:
POST /tournaments/:id/start

Regras:

Apenas dono

pode iniciar

Ao iniciar
embaralhar jogadores
criar confrontos

Exemplo:
João x Pedro

Carlos x Lucas

Maria x Ana

Entrega:

Partidas criadas automaticamente

---

Sprint 6
Gestão das Partidas

Objetivo:

Registrar vencedores.

Endpoints:

GET /tournaments/:id/matches

PUT /matches/:id/result

Regras:

Apenas dono

informa vencedor

Atualização
fechar partida
avançar vencedor

Entrega:

Fluxo do torneio funcionando

---

Sprint 7
Finalização do Torneio

Objetivo:

Definir campeão.

Implementar:

Quando restar
1 jogador

Criar registro:
tournament_history

Atualizar:
status = FINISHED

Entrega:
Campeão definido

---

Sprint 8
Estatísticas

Objetivo:

Dashboard.

Endpoints:

GET /statistics/me

Retornar:

{
"tournamentsPlayed": 10,
"tournamentsWon": 3,
"matchesPlayed": 42,
"matchesWon": 30,
"winRate": 71
}

Entrega:

Dashboard MVP

---

Sprint 9
Histórico

Objetivo:

Ver torneios antigos.

Endpoints:

GET /history
GET /history/:id

Mostrar:

campeão
participantes
partidas
data

Entrega:
Histórico completo

---

Sprint 10
Testes

Objetivo:

Cobertura mínima.

Implementar:

Unitários
Services
Integração
Auth
Tournament

Entrega:

70%+ cobertura

---

Sprint 11
Deploy

Backend:

Docker
Railway ou Render

Banco:

Neon PostgreSQL

CI/CD:

GitHub Actions

Entrega:
API pública
