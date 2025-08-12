# 🌿 Wellness Session Platform

A full-stack wellness session app for creating, drafting, and publishing wellness sessions like yoga and meditation. Built with **Node.js**, **Express**, **MongoDB**, and **React** — featuring secure JWT authentication, session drafts with auto-save, and email verification.

---

Email: user1@example.com
Password: 123456

## 🔗 Live Demo

- **Frontend:** [wellness-path-livid.vercel.app](https://wellness-path-livid.vercel.app)  
- **Backend:** [wellnesspath-server.onrender.com](https://wellnesspath-server.onrender.com)  
- **GitHub Repo:** [github.com/souravxyz/WellnessPath](https://github.com/souravxyz/WellnessPath)

---

## ✨ Features

### 🔐 Authentication  
- User registration with hashed passwords  
- JWT-based login and protected routes  
- Email verification for publishing sessions  
- Profile update with image upload  

### 🧘 Session Management  
- View public wellness sessions  
- Create, draft (auto-save), and publish user sessions  
- Edit and delete user sessions  
- Auto-save draft after 5s inactivity  

---

## 🛠️ Tech Stack

| Layer         | Technology                  |
|---------------|----------------------------|
| Frontend      | React.js                   |
| Backend       | Node.js, Express           |
| Database      | MongoDB (Atlas)            |
| Authentication| JWT, bcrypt                |
| File Upload   | Multer, Cloudinary         |
| Email Service | Brevo SMTP                 |
| Deployment    | Render (backend), Vercel (frontend) |

---

## 🚀 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/souravxyz/WellnessPath
cd WellnessPath

# 2. Install backend dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your own credentials

# 4. Run the backend server
npm run dev

# 5. Run frontend
cd client
npm install
npm start

Backend runs on: http://localhost:4545 

Frontend runs on: http://localhost:5173 