# Event → Queue → Push (JavaScript)

Pipeline:
Webhook → Redis Stream → Worker → Firebase Cloud Messaging → Dashboard

## 🚀 Setup
```bash
npm install
cp .env.example .env
npm run dev   # start Next.js
npm run worker # start worker
