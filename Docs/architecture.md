# Phase 2 Folder Architecture

Based on the requirements in `discription.md` (specifically the move to Next.js, Prisma, and the App Router), here is the recommended folder architecture for your final Phase 2 project:

```text
Orbit/
├── prisma/                     # Database configuration and models
│   ├── schema.prisma           # Your database models (User, Post, Comment, etc.)
│   └── seed.js                 # Script to initialize your database with dummy data
│
├── app/                        # Next.js App Router (Frontend Pages & Backend APIs)
│   ├── api/                    # Backend API Routes
│   │   ├── posts/
│   │   │   └── route.js        # GET/POST for posts
│   │   ├── users/
│   │   │   └── route.js        # GET/POST for users
│   │   └── comments/
│   │       └── route.js        # GET/POST for comments
│   │
│   ├── statistics/             # NEW: Phase 2 Statistics Page
│   │   └── page.js             # Displays the 6 required statistics
│   │
│   ├── profile/                # Profile Page
│   │   └── page.js
│   │
│   ├── layout.js               # Main layout (Navbar, Footer, etc. kept from Phase 1)
│   ├── page.js                 # Home page / News Feed
│   └── globals.css             # Global styles (moved from Phase 1)
│
├── components/                 # Reusable UI Components (Your Phase 1 UI)
│   ├── Post.js                 # Post component
│   ├── Navbar.js               # Navigation bar
│   └── Comment.js              # Comment component
│
├── lib/                        # Utility functions and database connection
│   └── prisma.js               # Initializes and exports the Prisma Client
│
├── public/                     # Static assets
│   └── images/                 # Logos, default avatars, etc.
│
├── .env                        # Environment variables (Database URL, etc.)
├── package.json                # Project dependencies (Next.js, Prisma, etc.)
└── next.config.js              # Next.js configuration
```

### Key Areas to Focus On for Phase 2:

1. **`prisma/` Directory:** This is entirely new for Phase 2. `schema.prisma` is where you will define your relational models (User, Post, Like, Follow), and `seed.js` is where you write the script to populate the database.
2. **`app/api/` Directory:** This acts as your backend. Instead of reading from `localStorage`, your frontend will make `fetch()` requests to these routes, which will in turn query the database using Prisma.
3. **`app/statistics/page.js`:** This is the brand new page required for Phase 2 to show your database analytics (average followers, most active user, etc.).
4. **`components/` Directory:** This is where you will reuse your UI from Phase 1. You'll convert your vanilla HTML/JS into React components, keeping the same CSS and design.
5. **`lib/prisma.js`:** A best practice file to ensure you don't open too many database connections during development. It just exports a single instance of the Prisma client for your API routes to use.
