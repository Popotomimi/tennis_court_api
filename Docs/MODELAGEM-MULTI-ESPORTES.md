# Modelagem Multi-Esportes

## 1. Objetivo

Este documento define a evolução da modelagem do banco de dados da Tennis League API para permitir que a plataforma trabalhe com múltiplos esportes.

Atualmente a API foi criada inicialmente pensando em torneios de tênis.

A nova modelagem deverá permitir que um mesmo sistema gerencie torneios de:

- Tênis
- Beach Tennis
- Pickleball

A arquitetura também deve ficar preparada para receber novos esportes futuramente sem a necessidade de criar uma nova estrutura de banco para cada modalidade.

---

## 2. Princípio da Modelagem

Não criar uma tabela diferente para cada esporte.

Não criar modelos como:

```text
TennisTournament
BeachTennisTournament
PickleballTournament
```
