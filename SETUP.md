# AI README Generator - Dependencies Installed

## ✅ Backend Dependencies Installed

### Production Dependencies:
- **express** (^5.2.1) - Web framework
- **mongoose** (^9.2.0) - MongoDB ODM
- **dotenv** (^17.2.4) - Environment variables
- **cors** (^2.8.6) - Cross-Origin Resource Sharing
- **bcryptjs** (^3.0.3) - Password hashing
- **jsonwebtoken** (^9.0.3) - JWT authentication
- **axios** (^1.13.5) - HTTP client
- **express-validator** (^7.3.1) - Input validation

### Dev Dependencies:
- **nodemon** (^3.1.11) - Auto-restart server on changes

### Scripts:
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

---

## ✅ Frontend Dependencies Installed

### Production Dependencies:
- **react** (^19.2.4) - UI library
- **react-dom** (^19.2.4) - React DOM renderer
- **react-router-dom** (^7.13.0) - Routing
- **axios** (^1.13.5) - HTTP client

### Dev Dependencies:
- **vite** (^7.3.1) - Build tool
- **@vitejs/plugin-react** (^5.1.4) - React plugin for Vite

### Scripts:
- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🚀 Quick Start

### Start Backend:
```bash
cd backend
npm run dev
```
Server will run on: http://localhost:5000

### Start Frontend:
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

---

## 📝 Next Steps

1. Configure `.env` file in backend with:
   - MONGO_URI
   - JWT_SECRET
   - GITHUB_CLIENT_ID
   - GITHUB_CLIENT_SECRET

2. Start coding your application logic in the empty files!

3. The frontend is configured to proxy `/api` requests to `http://localhost:5000`
