# Social Media Platform – Project Description

## Course
**CMPS 350 – Web Development Fundamentals**

## Project Phase
Phase 1

## Overview
This project involves developing the **front-end of a social media platform** similar to Twitter, Instagram, or TikTok. The objective is to create a **user-friendly, responsive, and visually appealing interface** using only **HTML5, CSS3, and Vanilla JavaScript**.

The application will allow users to create accounts, post content, interact with posts, and follow other users. Since there is no backend server in this phase, all data will be stored locally in the browser using **localStorage**.

The system is designed with **one user type** where each user can post content, follow other users, and interact with posts through likes and comments.

---

# Core Features

## 1. User Authentication
Users must be able to:
- Register a new account
- Log into the system

Each user account includes:
- User ID (unique identifier)
- Username
- Email address
- Password
- Profile picture

Registration forms must include **validation**, such as:
- Correct email format
- Password strength requirements

---

## 2. User Profile
Each user will have a **profile page** that displays:
- Username
- Profile picture
- Bio
- Posts created by the user

The logged-in user should also be able to **edit their profile information**.

---

## 3. News Feed
The **news feed** is the main page of the application.

It displays posts from users that the current user follows.

Each post should show:
- Author username
- Post content
- Timestamp

Posts should appear in a chronological feed format.

---

## 4. Create, Delete, and View Posts
Users must be able to:
- Create new posts (text-based)
- Delete their posts
- View individual posts in detail

Each post may also display its **comments and interactions**.

---

## 5. Like and Comment on Posts
Users can interact with posts by:
- Liking posts
- Adding comments

The system must update and display the **like count** dynamically.

Comments should appear below each post.

---

## 6. Follow and Unfollow Users
Users must be able to:
- Follow other users
- Unfollow users

Following a user allows their posts to appear in the **news feed**.

---

# Technical Requirements

The project must be built using the following technologies:

## HTML5
Use **semantic HTML elements** to structure the page properly.

Examples:
- `<nav>`
- `<main>`
- `<section>`
- `<header>`
- `<footer>`

---

## CSS3
All layouts must be built using:

- **Flexbox**
- **CSS Grid**

The website must be **fully responsive** and adapt to different screen sizes.

⚠️ **CSS frameworks like Bootstrap are NOT allowed.**

---

## Vanilla JavaScript (ES6+)
All interactive functionality must be implemented using **plain JavaScript**.

This includes:
- DOM manipulation
- Event handling
- Creating and updating elements dynamically
- Managing application data

No external libraries or frameworks are allowed.

---

## Git & GitHub
The project must be managed using **Git version control**.

Requirements:
- Code hosted in a **GitHub repository**
- Proper commit history
- Collaborative development among team members

---

# Data Handling

Since there is **no backend server**, all data must be stored in the browser.

## Local Storage
The application must use the browser’s **localStorage API** to persist data between page reloads and browser sessions.

---

## JSON Format
All application data must be stored in **JSON format**.

Examples of stored data:
- Users
- Posts
- Likes
- Comments
- Followers

Use:

```javascript
JSON.stringify()