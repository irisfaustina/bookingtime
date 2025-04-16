<div align="center">

# 📅 bookingtime

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern scheduling platform that makes booking appointments effortless.

[Key Features](#key-features) • [Getting Started](#getting-started) • [Tech Stack](#tech-stack) • [Documentation](#documentation)

</div>

## 🌟 Key Features

- 🔐 **Secure Authentication** - User management with Clerk
- 📊 **Event Management** - Create and manage booking events
- ⏰ **Smart Scheduling** - Set weekly availability with timezone support
- 🔄 **Real-time Updates** - Instant booking confirmations
- 📱 **Responsive Design** - Optimized for all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database
- Clerk account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/bookingtime.git
   cd bookingtime
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL=your_neon_database_url
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Run database migrations
   ```bash
   npm run db:migrate
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.2
- **UI**: Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Forms**: React Hook Form

### Backend
- **Runtime**: Next.js App Router
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle
- **Authentication**: Clerk

## 📖 Documentation

### Data Models

#### Event
```typescript
interface Event {
  id: UUID
  name: string
  description?: string
  durationInMinutes: number
  clerkUserId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Schedule
```typescript
interface Schedule {
  id: UUID
  timezone: string
  clerkUserId: string
  createdAt: Date
  updatedAt: Date
}
```

### API Routes

- `GET /api/events` - List user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `GET /api/schedule` - Get user's schedule
- `POST /api/book` - Book a time slot

## 🔧 Scripts

```bash
# Development
npm run dev         # Start development server
npm run build      # Build for production
npm run start      # Start production server

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database UI

# Testing
npm run lint       # Run ESLint
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `git push` to main branch

### Environment Variables

Required variables for deployment:
```env
DATABASE_URL
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [Neon Database](https://neon.tech/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
