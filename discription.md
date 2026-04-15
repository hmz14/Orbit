# CMPS 350 Project Guide

## 📌 Overview

This document explains the difference between **Phase 1** and **Phase 2** of your Web Development project and what changes are required when moving from Phase 1 to Phase 2.

---

# 🚀 Phase 1 – Frontend (Client-Side Only)

## 🎯 Goal

Build a **social media platform interface** using only frontend technologies.

## 🧰 Technologies Used

* HTML5
* CSS3 (Flexbox & Grid)
* Vanilla JavaScript (ES6)
* localStorage (for data persistence)

## 🔑 Core Features

* User registration & login
* User profile page
* News feed
* Create / delete posts
* Like posts
* Comment on posts
* Follow / unfollow users

## 💾 Data Handling

* All data stored in **localStorage**
* Data saved in **JSON format**
* No backend or database

## 🧠 Key Concept

> The application is fully running in the browser (frontend only).

---

# ⚡ Phase 2 – Full Stack Upgrade

## 🎯 Goal

Convert your Phase 1 project into a **real full-stack application** with a database and backend.

---

## 🔄 What Changes in Phase 2

### 1. Replace localStorage with Database

* Use a **relational database** (Postgres, SQLite, etc.)
* Use **Prisma ORM**
* No more JSON/localStorage storage

---

### 2. Data Modeling

Design and implement database models such as:

* User
* Post
* Comment
* Like
* Follow

Example relationships:

* One user → many posts
* One post → many comments
* Users can follow other users

---

### 3. Database Initialization (seed.js)

* Create a `seed.js` file
* Populate database with initial data
* Include enough data for statistics

---

### 4. Data Repository Layer

Create functions to interact with the database:

* Create data
* Read data
* Update data
* Delete data

⚠️ Important:

* Filtering & sorting must be done in **database queries**, not JavaScript

---

### 5. Backend APIs (Next.js)

Create API routes:

```
/app/api/posts/route.js
/app/api/users/route.js
/app/api/comments/route.js
```

Example:

```js
export async function GET() {
  const posts = await prisma.post.findMany();
  return Response.json(posts);
}
```

---

### 6. Connect Frontend to APIs

#### Before (Phase 1):

```js
const posts = JSON.parse(localStorage.getItem("posts"));
```

#### After (Phase 2):

```js
const res = await fetch("/api/posts");
const posts = await res.json();
```

---

### 7. Statistics Page (NEW FEATURE)

Create a page showing at least **6 statistics**, such as:

* Average followers per user
* Average posts per user
* Most active user
* Most used word in posts

---

## 🔧 What You Modify from Phase 1

### Update These Features:

* Authentication → use database
* Posts → fetch/store from DB
* Comments → store in DB
* Likes → store in DB
* Follow system → store in DB
* Profile → fetch real data from DB

---

## ✅ What You Keep

* UI design
* Layout (pages, navbar, etc.)
* Feature ideas

---

## 🔁 Transformation Summary

| Phase 1       | Phase 2         |
| ------------- | --------------- |
| Frontend only | Full-stack app  |
| localStorage  | Database        |
| Vanilla JS    | Next.js         |
| No backend    | API routes      |
| No analytics  | Statistics page |

---

## 🧠 Final Understanding

* **Phase 1** = Demo version (frontend simulation)
* **Phase 2** = Real application (database + backend + analytics)

---

## ✅ Checklist for Phase 2

* [ ] Convert project to Next.js
* [ ] Setup Prisma & database
* [ ] Create data models
* [ ] Write seed.js
* [ ] Build API routes
* [ ] Replace localStorage with API calls
* [ ] Implement statistics page
* [ ] Write report (data model, queries, tests, screenshots)

---

## 🎯 Final Tip

> Don’t rebuild everything. Reuse your UI and upgrade the logic behind it.

---

🔥 Good luck bro — Phase 2 is where your project becomes a REAL app!
