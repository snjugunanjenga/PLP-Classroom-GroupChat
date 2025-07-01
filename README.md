# Classroom Group Chat App

A real-time, WhatsApp-inspired chat application for classroom groups, built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io. Designed for students and teachers to communicate in groups or privately, with a modern, responsive UI and secure authentication.

---

## Features
- **User Authentication:** JWT-based login/register (username & password)
- **Group Chats:** Create, join, leave, and manage classroom groups
- **Private Messaging:** 1:1 real-time chat between users
- **Real-Time Messaging:** Powered by Socket.io
- **Typing Indicators:** See when others are typing
- **Online/Offline Status:** See who is online
- **Unread Message Badges:** WhatsApp-style indicators
- **Group Admin Controls:** Remove members, transfer admin rights
- **Responsive UI:** WhatsApp-like layout, mobile-friendly, dark theme
- **Error Boundaries:** Robust error handling in the UI
- **Testing:** Backend (Jest, Supertest) and frontend (React Testing Library)

---

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, shadcn-ui, Socket.io-client
- **Backend:** Node.js, Express.js, Socket.io, MongoDB (Mongoose)
- **Testing:** Jest, Supertest, React Testing Library
- **Deployment:** Render.com

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- MongoDB instance (local or Atlas)

### 1. Clone the Repository
```sh
git clone https://github.com/snjugunanjenga/PLP-Classroom-GroupChat.git
cd classroom-chat
```

### 2. Setup Environment Variables

#### **Backend (`server/.env`)**
```
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/classroom-chat
```

#### **Frontend (`client/.env`)**
```
VITE_API_URL=http://localhost:5000
```

### 3. Install Dependencies
```sh
cd server && pnpm install
cd ../client && pnpm install
```

### 4. Run Locally
**Backend:**
```sh
cd server
pnpm run dev
```
**Frontend:**
```sh
cd client
pnpm run dev
```

---

## Testing
**Backend:**
```sh
cd server
pnpm test
```
**Frontend:**
```sh
cd client
pnpm test
```

---

## Deployment (Render.com)
- Deploy `server` and `client` as separate services.
- Set environment variables in Render dashboard:
  - **Server:** `JWT_SECRET`, `MONGODB_URI`
  - **Client:** `VITE_API_URL` (pointing to your Render backend URL)
- Build/Start commands:
  - **Server:**
    - Build: `pnpm install`
    - Start: `node index.js`
  - **Client:**
    - Build: `pnpm install && pnpm run build`
    - Start: `pnpm run preview`
- WebSocket support is enabled by default on Render.

---

## Screenshots
Add screenshots of the app here (login, chat, group management, etc.)

---
## Author : Cpt N


## License
MIT 
