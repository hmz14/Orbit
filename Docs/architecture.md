# Phase 2 Folder Architecture

```text
Orbit/
│
├── pages/                         
│   ├── login/
│   │   ├── login.html
│   │   ├── login.css
│   │   └── login.js
│   ├── register/
│   │   ├── register.html
│   │   ├── register.css
│   │   └── register.js
│   ├── feed/
│   │   ├── feed.html
│   │   ├── feed.css
│   │   └── feed.js
│   ├── profile/
│   │   ├── profile.html
│   │   ├── profile.css
│   │   └── profile.js
│   ├── post/
│   │   ├── post.html
│   │   ├── post.css
│   │   └── post.js
│   └── shared/
│       ├── shared.css              # Shared styles across all pages
│       └── storage.js              # localStorage helpers (Phase 1)
│
├── app/                            # Phase 2 — Next.js backend + statistics page only
│   ├── api/                        # Backend API routes
│   │   ├── users/
│   │   │   └── route.js            # GET all users / POST new user
│   │   ├── posts/
│   │   │   └── route.js            # GET all posts / POST new post
│   │   ├── comments/
│   │   │   └── route.js            # GET comments / POST new comment
│   │   ├── likes/
│   │   │   └── route.js            # POST like / DELETE unlike
│   │   └── follow/
│   │       └── route.js            # POST follow / DELETE unfollow
│   │
│   └── statistics/
│       └── page.js                 # Statistics page (6 required analytics) — NEW in Phase 2
│
├── lib/                            # Shared utilities and database layer
│   ├── prisma.js                   # Prisma client singleton
│   └── repositories/               # Data repository layer (one file per model)
│       ├── userRepository.js       # CRUD + search for users
│       ├── postRepository.js       # CRUD + most liked posts
│       ├── commentRepository.js    # CRUD for comments
│       ├── likeRepository.js       # like / unlike / count
│       └── followRepository.js     # follow / unfollow / counts
│
├── prisma/                         # Database configuration
│   ├── schema.prisma               # Data models: User, Post, Comment, Like, Follow
│   ├── seed.js                     # Populates DB with 100 users, 200 posts, etc.
│   └── migrations/                 # Auto-generated migration history
│
├── assets/                         # Static assets
│   ├── icons/
│   │   └── orbit_logo.png
│   ├── images/
│   │   └── profile.svg
│   ├── post_pic/                   # Sample post images
│   └── profile_pic/                # Sample profile pictures
│
├── data/
│   └── seed.js                     # Phase 1 seed data (localStorage)
│
├── Docs/
│   └── architecture.md             # This file
│
├── .env                            # DATABASE_URL and other environment variables
├── package.json
└── discription.md                  # Project requirements
```

---

### Layer Responsibilities

| Layer | Location | Purpose |
|---|---|---|
| **Phase 1 UI** | `pages/` | Original HTML pages — kept as reference |
| **API Routes** | `app/api/` | Backend endpoints — call repositories, return JSON |
| **Repositories** | `lib/repositories/` | All DB queries live here — no raw Prisma in routes |
| **Prisma Client** | `lib/prisma.js` | Single shared instance — prevents connection leaks |
| **Schema** | `prisma/schema.prisma` | Source of truth for all data models |
| **Seed** | `prisma/seed.js` | Populates DB with realistic dummy data |

---

### Data Flow

```
Browser
  └── fetch("/api/posts")
        └── app/api/posts/route.js
              └── lib/repositories/postRepository.js
                    └── lib/prisma.js
                          └── prisma/dev.db  (SQLite)
```
