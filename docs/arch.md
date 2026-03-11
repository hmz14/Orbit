# Project Architecture

Overview of the folder structure and how the app is organized.

---

## Directory layout

```
Orbit/
├── pages/           # All page-level UI (HTML, CSS, JS per page)
│   ├── login/
│   ├── register/
│   ├── feed/
│   ├── profile/
│   └── post/
├── shared/          # Code and styles used by multiple pages
│   ├── helpers.js
│   ├── auth.js
│   └── shared.css
├── storage/         # Data persistence (e.g. localStorage)
│   └── storage.js
├── assets/          # Static files (images, icons)
│   ├── images/
│   └── icons/
├── docs/            # Project documentation
└── README.md
```

---

## pages/

Each route/screen has its own folder with:

- **`.html`** – Markup and structure
- **`.css`** – Page-specific styles
- **`.js`** – Page-specific logic

| Page      | Role |
|----------|------|
| **login/**   | Login form and authentication entry |
| **register/**| New user registration |
| **feed/**    | Main feed: list posts, create, like, comment, delete |
| **profile/** | User profile, edit, user’s posts, follow/unfollow |
| **post/**    | Single post view, comments, like |

---

## shared/

Reusable logic and styles:

- **helpers.js** – Utilities (IDs, date formatting, URL params, redirects)
- **auth.js** – Login check, redirect when not logged in, logout, route protection
- **shared.css** – Common UI (buttons, forms, layout, nav, colors, typography)

---

## storage/

- **storage.js** – All reads/writes to localStorage (users, posts, comments, current user).  
  Functions such as: `getUsers()`, `saveUsers()`, `getPosts()`, `savePosts()`, `getCurrentUser()`.

---

## assets/

- **images/** – Profile pictures, logos, default avatars
- **icons/** – UI icons (e.g. like, comment, follow)

---

## Design choices

- **One folder per page** – Clear ownership and easy navigation
- **Shared code in `shared/`** – No duplicated helpers or auth logic
- **Data access in `storage/`** – Single place for persistence
- **Docs in `docs/`** – All project documentation (including this file) in one place
