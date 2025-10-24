# 🧠 Neuctra Notexa

**Neuctra Notexa** is an advanced, AI-powered cloud note-taking app designed for creativity, collaboration, and productivity.  
Built with **React + Vite**, it offers seamless sync, real-time sharing, and intelligent AI assistance — all wrapped in a beautiful modern interface.

---

## ✨ Features

### 🧩 Core Features
- 📝 **Smart Notes Creation** — Write, organize, and edit notes effortlessly.
- ☁️ **Cloud Storage** — Notes are securely stored and synced across devices.
- 🤝 **Real-Time Collaboration** — Collaborate live with teammates or friends.
- 🔗 **Note Sharing** — Share notes via secure tokens or public preview links.
- 🤖 **AI Assistance** — Generate, summarize, or rewrite content instantly using built-in AI tools.
- 🌓 **Dark / Light Mode** — Smooth automatic theme switching.
- 🔐 **User Authentication** — Secure signup, login, and session management via [Neuctra Authix](https://neuctra.com/authix).
- 📦 **User Packages & Limits** — Integrated note limits and storage management.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 18 + Vite |
| **Auth & User Management** | [@neuctra/authix](https://www.npmjs.com/package/@neuctra/authix) |
| **Styling** | Tailwind CSS + Framer Motion |
| **State Management** | React Context + Local Storage |
| **Notifications** | React Hot Toast |
| **Routing** | React Router DOM |
| **Icons** | Lucide React |
| **AI Backend** | OpenRouter / Neuctra AI APIs |
| **Deployment** | Vercel / Netlify compatible |

---

## ⚙️ Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/neuctra-notexa.git
cd neuctra-notexa
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
```

Your app will be available at:

```
http://localhost:5173
```


---

## 🌐 Key Pages

* `/` → Landing Page
* `/login` → Sign in with Authix
* `/signup` → Create your account
* `/notes` → Dashboard for managing notes
* `/notes/create` → Create a new note
* `/notes/edit/:id` → Edit existing note
* `/collab/:token` → Real-time collaboration
* `/preview/:token` → Public note preview

---

## 🤖 AI Features (Powered by OpenRouter)

* Generate note content based on prompts.
* Summarize long notes intelligently.
* Rewrite or improve writing tone.
* Auto-categorize notes based on context.

---

## 🧭 Environment Variables

Create a `.env` file in your project root:

```bash
VITE_APP_ID=your-neuctra-app-id
VITE_API_KEY=your-authix-api-key
VITE_AUTHIX_BASE_URL=https://server.authix.neuctra.com/api
```

---

## 📸 UI Highlights

* ⚡ Fast Hot Reload with Vite
* 🎨 Modern Glassmorphic Design
* 💬 Centered Toast Notifications
* 🧑‍💻 Developer Friendly & Extensible

---

## 🚀 Deployment

Build the optimized production bundle:

```bash
npm run build
```

Then deploy the `dist` folder to:

* [Vercel](https://vercel.com)
* [Netlify](https://www.netlify.com)
* [Cloudflare Pages](https://pages.cloudflare.com)

---

## 🧑‍💻 Author

**Taha Asif**
Full-Stack Developer & AI Systems Architect
🔗 [https://neuctra.com](https://neuctra.com)

---

## 📄 License

This project is licensed under the **MIT License**.
Feel free to use, modify, and distribute with attribution.

---

### 💡 “Neuctra Notexa — where intelligence meets creativity.”
