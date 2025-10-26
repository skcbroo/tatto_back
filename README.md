# Tattoo Marketplace Backend

Backend API para o aplicativo Tattoo Marketplace.

## Tecnologias

- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Bcrypt (hash de senhas)

## Estrutura do Projeto

```
server/
├── src/
│   ├── config/          # Configurações (DB, env)
│   ├── middleware/      # Middleware (auth, errors)
│   ├── models/          # Models do banco de dados
│   ├── controllers/     # Controladores (lógica)
│   ├── routes/          # Rotas da API
│   ├── utils/           # Utilitários (JWT, password, etc)
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── migrations/          # SQL migrations
└── package.json
```

## Setup

### 1. Instalar dependências

```bash
cd server
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o `.env`:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=seu-secret-super-seguro
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Criar banco de dados no Railway

No Railway:

1. Vá em "New Project"
2. Adicione "PostgreSQL"
3. Copie a `DATABASE_URL` gerada
4. Cole no seu `.env`

### 4. Rodar a migration

Execute a migration SQL no banco de dados:

```bash
# No Railway, vá em PostgreSQL > Data > Query
# Cole o conteúdo de: migrations/001_initial_schema.sql
# Execute o SQL
```

Ou use um cliente PostgreSQL como o `psql`:

```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### 5. Rodar o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build
npm run build

# Produção
npm start
```

## Rotas da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Obter usuário atual (autenticado)

### Usuários

- `GET /api/users/:id` - Obter perfil de usuário
- `PUT /api/users/profile` - Atualizar perfil (autenticado)
- `DELETE /api/users/account` - Deletar conta (autenticado)

### Artistas

- `GET /api/artists` - Listar artistas (com filtros opcionais)
- `GET /api/artists/:id` - Obter artista específico
- `GET /api/artists/my-profile` - Obter perfil do artista (autenticado, role: artist)
- `PUT /api/artists/profile` - Atualizar perfil do artista (autenticado, role: artist)

### Serviços

- `POST /api/services` - Criar serviço (autenticado, role: artist)
- `GET /api/services/artist/:artistId` - Listar serviços de um artista
- `PUT /api/services/:id` - Atualizar serviço (autenticado, role: artist)
- `DELETE /api/services/:id` - Deletar serviço (autenticado, role: artist)

### Agendamentos

- `POST /api/appointments` - Criar agendamento (autenticado)
- `GET /api/appointments/my-appointments` - Listar meus agendamentos (autenticado)
- `GET /api/appointments/:id` - Obter agendamento específico (autenticado)
- `PATCH /api/appointments/:id/status` - Atualizar status (autenticado)
- `DELETE /api/appointments/:id` - Deletar agendamento (autenticado)

### Reviews

- `POST /api/reviews` - Criar review (autenticado)
- `GET /api/reviews/artist/:artistId` - Listar reviews de um artista
- `PUT /api/reviews/:id` - Atualizar review (autenticado)
- `DELETE /api/reviews/:id` - Deletar review (autenticado)

### Mensagens

- `POST /api/messages` - Enviar mensagem (autenticado)
- `GET /api/messages/my-messages` - Listar minhas mensagens (autenticado)
- `GET /api/messages/conversation/:userId` - Obter conversa com usuário (autenticado)
- `PATCH /api/messages/:id/read` - Marcar como lida (autenticado)

### Favoritos

- `POST /api/favorites` - Adicionar favorito (autenticado)
- `GET /api/favorites/my-favorites` - Listar favoritos (autenticado)
- `DELETE /api/favorites/:artistId` - Remover favorito (autenticado)

## Deploy no Railway

### 1. Criar novo projeto no Railway

1. Vá em https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Conecte seu repositório

### 2. Adicionar PostgreSQL

1. No projeto, clique em "New"
2. Selecione "Database" > "PostgreSQL"
3. A `DATABASE_URL` será gerada automaticamente

### 3. Configurar variáveis de ambiente

No Railway, adicione as variáveis:

```
PORT=3000
NODE_ENV=production
JWT_SECRET=seu-secret-super-seguro
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://seu-frontend.vercel.app
```

A `DATABASE_URL` é automática do PostgreSQL do Railway.

### 4. Configurar o Build

O Railway detecta automaticamente, mas se necessário:

- Build Command: `npm run build`
- Start Command: `npm start`

### 5. Rodar a migration

Após deploy, execute a migration:

1. Vá em PostgreSQL > Data > Query
2. Cole o SQL de `migrations/001_initial_schema.sql`
3. Execute

## Testando a API

Use ferramentas como:
- Postman
- Insomnia
- Thunder Client (VS Code)
- curl

Exemplo de registro:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123",
    "role": "customer"
  }'
```

## Segurança

- Senhas são hasheadas com bcrypt
- JWT para autenticação
- Helmet para segurança de headers HTTP
- CORS configurado
- Validação de inputs
- Proteção contra SQL injection (queries parametrizadas)
