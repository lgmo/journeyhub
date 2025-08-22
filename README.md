# Requisitos

- **Docker**
- **bun**

# Instalação

```bash
# Dentro de backend rode
docker compose up -d
bun install
bun run dev
```

o servidor estará rodando em `http://localhost:8000`

# Fluxo de uso

# 1. Criar usuário
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password"}'

# 2. Listar usuários
curl http://localhost:8000/api/users

# 3. Criar jornada para um usuário (substitua USER_ID pelo id retornado do usuário)
curl -X POST http://localhost:8000/api/users/USER_ID/journeys \
  -H "Content-Type: application/json" \
  -d '{"name":"Minha Jornada","actions":[{"name":"Ação 1","type":"email","content":"conteúdo","timeOffset":0}],"startTime":1692700000000}'

# 4. Listar jornadas de um usuário
curl http://localhost:8000/api/users/USER_ID/journeys

# 5. Vincular uma jornada existente a um usuário (substitua USER_ID e JOURNEY_ID)
curl -X POST http://localhost:8000/api/journeys/USER_ID/journeys \
  -H "Content-Type: application/json" \
  -d '{"journeyId":"JOURNEY_ID"}'

# 6. Criar jornada e já vincular ao usuário (substitua USER_ID)
curl -X POST http://localhost:8000/api/journeys/USER_ID/journeys/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Nova Jornada","actions":[{"name":"Ação 2","type":"whatsapp","content":"msg","timeOffset":1000}],"startTime":1692700000000}'

# 7. Listar jornadas de um usuário (novamente)
curl http://localhost:8000/api/journeys/USER_ID/journeys