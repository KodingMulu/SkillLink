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

# 🚀 How to Run a Project (Setup & Installation)
1. Clone repository
   ```
   git clone https://github.com/KodingMulu/SkillLink.git
   cd skilllink
   ```
2. Go to the folder you want to run
   ```
   cd api      # or cd web or cd mobile
   ```
3. Instal dependencies
   ```
   npm install
   ```
4. Environment variable configuration
   ```
   Copy the .env.example file to .env and adjust the values.
   ```
5. Run the project
   For API & Web (Next.js)
   ```
   npm run dev
   ```

   For Mobile (React Native)
   ```
   npm run android    # or npm run web / npm run ios
   ```

# 🔑 Environment Variables (.env Example)
Here are examples of commonly used variables:
```
# Umum
NEXT_PUBLIC_API_URL=https://api.skilllink.com

# API / Backend
DATABASE_URL=postgresql://user:password@localhost:5432/skilllink
JWT_SECRET=your_jwt_secret_key
CLOUD_STORAGE_KEY=your_storage_key

# Web
NEXT_PUBLIC_BASE_URL=https://skilllink.vercel.app

# Mobile
EXPO_PUBLIC_API_URL=https://api.skilllink.com
```
```
💡 Save the .env file locally and do not upload it to GitHub.
When deploying to hosting such as Vercel, add these variables via the Project Settings → Environment Variables menu.
```

# 🧩 Key Features
- 👥 Student & Industry Collaboration – Students can join real projects from companies.
- 🧾 Automatic Portfolio – Completed projects are automatically saved as a portfolio.
- 💬 Internal Communication System – Chat or discussion between project team members.
- 📱 Cross-Platform Access – Web and mobile apps are connected through a single API.
- 🔒 Secure Authentication – Uses JWT and separate environment variables for each service.

# 🌐 Deployment / Hosting Info
```
| Section      | Recommendation Platform                                       | Notes                                              |
| ------------ | ------------------------------------------------------------- | -------------------------------------------------- |
| **API**      | [Render](https://render.com) / [Railway](https://railway.app) | Run the Next.js backend server                     |
| **Web**      | [Vercel](https://vercel.com)                                  | Automatically build and deploy from the repository |
| **Mobile**   | [Expo](https://expo.dev)                                      | Build and publish mobile applications              |
| **Database** | [Supabase](https://supabase.com) / PostgreSQL                 | Directly connected to the API                      |
```
