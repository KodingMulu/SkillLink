# 🧠 About SkillLink
SkillLink is a collaborative platform that helps students develop their portfolios through real-world projects with industry partners.

This project consists of three main parts:
- API (Next.js) – Provides backend services for authentication, data, and collaboration.
- Web (Next.js) – Web-based interface for students, campuses, and companies.
- Mobile (React Native) – Mobile application for quick access and project notifications.

SkillLink aims to bridge the academic and industrial worlds through an integrated ecosystem that encourages practical learning and career development for students.

# ⚙️ Tech Stack
SkillLink was developed using modern technology to ensure high performance, ease of development, and cross-platform flexibility:
## Backend & API
- Next.js – React Framework for API Routes and SSR
- Prisma / Supabase / PostgreSQL – Main ORM & Database
- JWT – Token-based Authentication

## Web App
- Next.js (React 18) – Primary frontend with App Router
- Tailwind CSS – Modern and responsive styling
- shadcn/ui – Ready-to-use UI components

## Mobile App
- React Native – Cross-platform mobile application
- Expo – Build & testing environment
- Axios / Fetch API – Connection to the SkillLink API

## Tools & Deployment
- Vercel – Web & API Deployment
- Expo / EAS – Building and implementing mobile applications

# 🗂️ Folder Structure
```
skilllink/
├── api/               # Folder backend (Next.js API)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env.example
│
├── web/               # Folder web app (Next.js Web)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── mobile/            # Folder mobile app (React Native)
│   ├── app/
│   ├── assets/
│   ├── package.json
│   └── app.json
│
├── README.md
└── package.json       # Root config (opsional untuk workspace management)
```
```
💡 Note:
Each folder (api, web, mobile) can be run and deployed separately.
Use each environment variable in hosting services such as Vercel, and Expo without having to upload .env files to the public.
```
