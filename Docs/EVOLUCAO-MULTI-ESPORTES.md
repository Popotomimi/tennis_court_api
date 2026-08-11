# Evolução da API — Suporte a Múltiplos Esportes

## 1. Objetivo

A API atualmente foi desenvolvida inicialmente para gerenciamento de torneios de tênis.

O próximo objetivo do projeto é evoluir a arquitetura para permitir que a mesma plataforma seja utilizada para diferentes esportes.

Neste primeiro momento, serão adicionados:

- Tênis
- Beach Tennis
- Pickleball

A arquitetura deve ser preparada de forma que futuramente seja possível adicionar outros esportes, como:

- Futebol
- Basquete
- Vôlei
- Tênis de mesa
- Futsal
- Entre outros

A ideia é evitar criar uma API diferente para cada esporte.

A plataforma deve trabalhar com o conceito genérico de `Tournament`, possuindo um esporte associado ao torneio.

---

# 2. Conceito de Esporte

Todo torneio deverá possuir um esporte.

Exemplo:

```text
Torneio:
Nome: Campeonato de Domingo
Esporte: Tênis
```
