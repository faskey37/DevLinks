# DevLinks 🔗

> A smart, full-stack Link-in-Bio tool for developers — built with Next.js 14, Firebase, Tailwind CSS, and shadcn/ui.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/devlinks)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## ✨ Features

- 🔐 **Authentication** — Email/password + Google OAuth via Firebase Auth
- 🗄️ **Database** — Firestore stores user profiles and link collections
- 🔗 **Link Management** — Add, edit, delete, and drag-to-reorder links
- 📊 **Click Analytics** — Track how many times each link gets clicked
- 🌙 **Dark Mode** — System-aware theme with manual toggle
- 🌍 **Public Profile** — Share your page at `/{username}` — SEO-optimized
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- ✅ **Type Safe** — Full TypeScript with Zod validation

---

## 🗂️ Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (theme, auth, navbar)
│   ├── page.tsx              # Landing page
│   ├── auth/signin/page.tsx  # Sign in / Sign up page
│   ├── dashboard/page.tsx    # Link management dashboard
│   ├── profile/page.tsx      # Profile settings
│   ├── [username]/page.tsx   # Public profile page
│   └── api/links/click/      # API: track link clicks
├── components/
│   ├── layout/Navbar.tsx     # Global navigation
│   ├── LinkCard.tsx          # Dashboard link card (edit/delete)
│   ├── AddLinkForm.tsx       # Add new link form
│   ├── PublicLinkButton.tsx  # Public profile link button
│   └── ui/Toaster.tsx        # Toast notifications
├── context/
│   └── AuthContext.tsx       # Global Firebase auth state
├── hooks/
│   └── useLinks.ts           # Firestore CRUD for links
├── lib/
│   ├── firebase.ts           # Firebase initialization
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com) project with:
  - Authentication enabled (Email/Password + Google providers)
  - Firestore database created (in test or production mode)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/devlinks.git
cd devlinks
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Firebase config values in `.env.local`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔥 Firebase Setup

### Firestore Security Rules

Go to Firestore → Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;

      match /links/{linkId} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add all `NEXT_PUBLIC_FIREBASE_*` environment variables
4. Deploy!

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | React framework (App Router) |
| TypeScript | Type safety |
| Firebase Auth | Authentication |
| Firestore | NoSQL database |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | UI component primitives |
| react-hook-form | Form handling |
| Zod | Schema validation |
| react-beautiful-dnd | Drag and drop |
| next-themes | Dark mode |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push and open a PR