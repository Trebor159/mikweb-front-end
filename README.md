# 🌐 MikWeb Frontend

Painel do cliente para provedor de internet.  
React + Vite + TypeScript + TailwindCSS — pronto para Vercel.

---

## 📁 Estrutura

```
src/
├── App.tsx                      # Roteador principal
├── main.tsx                     # Entry point
├── index.css                    # TailwindCSS + estilos globais
├── pages/
│   ├── LoginPage.tsx            # /login
│   ├── DashboardPage.tsx        # /dashboard
│   ├── FaturasPage.tsx          # /faturas (com modal Pix/Boleto)
│   ├── ConexaoPage.tsx          # /conexao
│   └── PerfilPage.tsx           # /perfil (troca de senha, logout)
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # Layout com sidebar
│   │   └── Sidebar.tsx          # Menu lateral
│   └── ui/
│       ├── Alert.tsx            # Alertas de sucesso/erro
│       ├── Spinner.tsx          # Loading spinner
│       └── StatusBadge.tsx      # Badge de status (pago, online...)
├── context/
│   └── AuthContext.tsx          # Login, logout, sessão
├── hooks/
│   └── useApi.ts                # Hook genérico para chamadas API
├── routes/
│   └── PrivateRoute.tsx         # Guard de rotas autenticadas
└── services/
    └── api.ts                   # Axios + todos os serviços da API
```

---

## 🚀 Rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar o .env
cp .env.example .env

# Edite o .env:
# VITE_API_URL=https://SEU-BACKEND.up.railway.app

# 3. Iniciar
npm run dev
# Abre em http://localhost:5173
```

---

## 🌍 Deploy na Vercel

### Opção A — pelo site (mais fácil)

1. Suba o código no GitHub
2. Acesse [vercel.com](https://vercel.com) → **Add New Project**
3. Selecione o repositório
4. Em **Environment Variables**, adicione:
   ```
   VITE_API_URL = https://SEU-BACKEND.up.railway.app
   ```
5. Clique em **Deploy** — pronto!

### Opção B — pelo terminal

```bash
npm install -g vercel
vercel login
vercel --prod
# Siga as instruções e defina a variável VITE_API_URL
```

### Arquivo vercel.json (necessário para React Router)

Crie um `vercel.json` na raiz:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
Sem isso, ao acessar `/faturas` diretamente vai dar 404.

---

## 🔗 Conectar com Railway (backend)

1. Acesse seu projeto no Railway
2. Clique no serviço do backend → **Settings → Domains**
3. Copie a URL pública (ex: `https://mikweb-simple-production.up.railway.app`)
4. Cole essa URL na variável `VITE_API_URL` da Vercel (sem barra no final)
5. Redeploy automático na Vercel

### CORS no backend

Certifique-se de que seu backend Node.js tem o CORS habilitado:
```typescript
// src/server.ts
app.use(cors()) // já está configurado no mikweb-simple
```

Se quiser restringir para só aceitar do seu domínio Vercel:
```typescript
app.use(cors({ origin: 'https://seu-projeto.vercel.app' }))
```

---

## ✨ Funcionalidades

| Página        | O que faz                                               |
|---------------|---------------------------------------------------------|
| `/login`      | Login com CPF (com máscara) + senha                     |
| `/dashboard`  | Resumo: status da conexão, última fatura, alertas       |
| `/faturas`    | Lista com filtros, modal com Pix e código de barras      |
| `/conexao`    | Status online/suspenso, velocidades, IP, vencimento     |
| `/perfil`     | Dados do cliente, alterar senha, WhatsApp, logout       |

---

## 🎨 Design

- **Tema**: Dark mode — azul profundo com acentos em azul elétrico
- **Fontes**: Sora (títulos) + DM Sans (corpo) + JetBrains Mono (códigos)
- **Componentes**: Cards com glassmorphism sutil, badges coloridos, animações fade/slide
- **Responsivo**: Layout adaptável com sidebar (desktop) e scroll (mobile)
