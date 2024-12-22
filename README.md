# Sistema de Controle de Estoque (SaaS)

Sistema de controle de estoque desenvolvido com Node.js (Backend) e React (Frontend).

## Estrutura do Projeto

```
estoque-saas/
├── backend/         # API REST com Node.js e Express
├── frontend/        # Interface com React e Material-UI
```

## Requisitos

- Node.js 16+
- NPM ou Yarn
- MongoDB (recomendado usar MongoDB Atlas)

## Instalação

### Backend

```bash
cd backend
npm install
```

Crie um arquivo .env na pasta backend com as seguintes variáveis:
```
PORT=5000
MONGODB_URI=sua_url_do_mongodb
JWT_SECRET=seu_segredo_jwt
```

### Frontend

```bash
cd frontend
npm install
```

## Executando o Projeto

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

O backend estará disponível em `http://localhost:5000`
O frontend estará disponível em `http://localhost:3000` 