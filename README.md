# TimeWise - Modern Event Scheduler

![TimeWise Banner](https://via.placeholder.com/1200x400/4f46e5/ffffff?text=TimeWise+Event+Scheduler)

TimeWise is a modern, intuitive event scheduling application built with Next.js, TypeScript, and Prisma. It helps you manage your daily events and tasks with ease, featuring a clean calendar interface and priority-based organization.

## ✨ Features

- 📅 Interactive calendar view
- ⚡ Quick event creation and editing
- 🎯 Priority-based event organization
- 🔍 Search and filter events
- 📱 Responsive design for all devices
- 🔄 Real-time updates
- 🔐 Secure authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mykhailokurochkin/timewise.git
   cd timewise
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/timewise?schema=public"

   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - The React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [date-fns](https://date-fns.org/) - Date utilities
- [React Query](https://tanstack.com/query) - Data fetching
- [NextAuth.js](https://next-auth.js.org/) - Authentication

Made by Mykhailo Kurochkin
