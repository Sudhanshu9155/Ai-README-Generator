# 🛡️ Premium Admin Dashboard

This is a standalone admin portal for the AI README Generator. It connects to the same database but operates independently to ensure security and isolation from the main application.

## ✨ Features

- **📊 Centralized Dashboard**: Real-time stats on users, pro members, and generation velocity.
- **👥 User Management**: Full list of users with the ability to grant/revoke **PRO** status instantly.
- **📜 Activity Monitoring**: Live stream of user actions (README creation, syncing, etc.).
- **🚨 Intelligence System**: Automatic detection of suspicious activity based on usage patterns.
- **💎 Premium UI**: Glassmorphism design system with dark mode and smooth animations.

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the main project dependencies installed. This dashboard uses the same MongoDB instance.

### 2. Backend Setup
```bash
cd admin/backend
npm install
npm run dev
```
*Runs on port 5001.*

### 3. Frontend Setup
```bash
cd admin/frontend
npm install
npm run dev
```
*Runs on port 3001.*

## 🔐 Credentials
Default credentials (change in `admin/backend/.env`):
- **Username**: `admin`
- **Password**: `admin123`

## 🛠️ Security Note
This admin panel is designed to be hosted separately or on a private network. It uses its own JWT secret and authentication layer.
