# Sprint 1 — Suporte a Múltiplos Esportes

## 1. Objetivo da Sprint

Evoluir a API atualmente existente para permitir que um torneio pertença a uma modalidade esportiva.

Nesta primeira etapa serão suportados:

- Tênis
- Beach Tennis
- Pickleball

A arquitetura deve continuar genérica para permitir a inclusão de novos esportes no futuro.

A implementação deve preservar todas as funcionalidades existentes da API.

---

# 2. Contexto Atual

A API atualmente possui uma estrutura completa para gerenciamento de torneios, incluindo:

- autenticação JWT;
- usuários;
- criação de torneios;
- participantes;
- geração automática de confrontos;
- registro de resultados;
- histórico;
- estatísticas;
- upload de avatar;
- Swagger;
- testes automatizados.

A arquitetura atual utiliza:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL
```
