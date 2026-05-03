# Orbit Project Report

## 1. Data Model

The application uses Prisma as an ORM with a SQLite database. The data model consists of five main entities: `User`, `Post`, `Comment`, `Like`, and `Follow`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id             Int      @id @default(autoincrement())
  username       String   @unique
  email          String   @unique
  password       String
  name           String?
  role           String   @default("USER")
  profilePicture String?
  bio            String?
  createdAt      DateTime @default(now())

  posts          Post[]
  comments       Comment[]
  likes          Like[]

  following      Follow[] @relation("UserFollowing")
  followers      Follow[] @relation("UserFollowers")
}

model Post {
  id        Int      @id @default(autoincrement())
  content   String
  images    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId  Int
  author    User @relation(fields: [authorId], references: [id], onDelete: Cascade)

  comments  Comment[]
  likes     Like[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())

  authorId  Int
  postId    Int

  author    User @relation(fields: [authorId], references: [id], onDelete: Cascade)
  post      Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}

model Like {
  createdAt DateTime @default(now())

  userId    Int
  postId    Int

  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post      Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@id([userId, postId])
}

model Follow {
  createdAt   DateTime @default(now())

  followerId  Int
  followingId Int

  follower    User @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  following   User @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
}
```

## 2. Database Queries

The application interacts with the database using Prisma Client. Below are the database queries used in the application across different entities.

### User Queries

**Get All Users:**
```javascript
export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}
```

**Get User by ID (with relations):**
```javascript
export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      followers: true,
      following: true,
    },
  });
}
```

**Get User by Username:**
```javascript
export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      followers: true,
      following: true,
    },
  });
}
```

**Get User by Email:**
```javascript
export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}
```

**Create User:**
```javascript
export async function createUser(data) {
  return prisma.user.create({
    data: {
      username:       data.username,
      email:          data.email,
      password:       data.password,
      name:           data.name ?? null,
      role:           data.role ?? "USER",
      profilePicture: data.profilePicture ?? null,
      bio:            data.bio ?? null,
    },
  });
}
```

**Update User:**
```javascript
export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data: {
      username:       data.username,
      email:          data.email,
      password:       data.password,
      name:           data.name,
      profilePicture: data.profilePicture,
      bio:            data.bio,
    },
  });
}
```

**Delete User:**
```javascript
export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}
```

**Search Users:**
```javascript
export async function searchUsers(query) {
  return prisma.user.findMany({
    where: {
      username: { contains: query },
    },
    orderBy: { username: "asc" },
  });
}
```

### Post Queries

**Get All Posts:**
```javascript
export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: { orderBy: { createdAt: "desc" } },
    },
  });
}
```

**Get Post by ID:**
```javascript
export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, profilePicture: true } },
        },
      },
    },
  });
}
```

**Get Posts by User:**
```javascript
export async function getPostsByUser(authorId) {
  return prisma.post.findMany({
    where:   { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: true,
    },
  });
}
```

**Create Post:**
```javascript
export async function createPost(data) {
  return prisma.post.create({
    data: {
      content:  data.content,
      authorId: data.authorId,
      images:   data.images,
    },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}
```

**Update Post:**
```javascript
export async function updatePost(id, content) {
  return prisma.post.update({
    where: { id },
    data:  { content },
  });
}
```

**Delete Post:**
```javascript
export async function deletePost(id) {
  return prisma.post.delete({
    where: { id },
  });
}
```

**Get Feed Posts (User's posts + Following's posts):**
```javascript
export async function getFeedPosts(userId) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const authorIds = [userId, ...follows.map((f) => f.followingId)];

  return prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      likes: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, profilePicture: true } },
        },
      },
    },
  });
}
```

**Get Most Liked Posts:**
```javascript
export async function getMostLikedPosts(limit = 10) {
  return prisma.post.findMany({
    orderBy: { likes: { _count: "desc" } },
    take:    limit,
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      likes:  true,
    },
  });
}
```

### Comment Queries

**Get Comments by Post:**
```javascript
export async function getCommentsByPost(postId) {
  return prisma.comment.findMany({
    where:   { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}
```

**Get Comments by User:**
```javascript
export async function getCommentsByUser(authorId) {
  return prisma.comment.findMany({
    where:   { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, content: true } },
    },
  });
}
```

**Get Comment by ID:**
```javascript
export async function getCommentById(id) {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      post:   { select: { id: true, content: true } },
    },
  });
}
```

**Create Comment:**
```javascript
export async function createComment(data) {
  return prisma.comment.create({
    data: {
      content:  data.content,
      authorId: data.authorId,
      postId:   data.postId,
    },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}
```

**Update Comment:**
```javascript
export async function updateComment(id, content) {
  return prisma.comment.update({
    where: { id },
    data:  { content },
  });
}
```

**Delete Comment:**
```javascript
export async function deleteComment(id) {
  return prisma.comment.delete({
    where: { id },
  });
}
```

### Like Queries

**Get Likes by Post:**
```javascript
export async function getLikesByPost(postId) {
  return prisma.like.findMany({
    where:   { postId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}
```

**Get Likes by User:**
```javascript
export async function getLikesByUser(userId) {
  return prisma.like.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, content: true } },
    },
  });
}
```

**Check if User Liked Post:**
```javascript
export async function getLike(userId, postId) {
  return prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
}
```

**Like a Post:**
```javascript
export async function likePost(userId, postId) {
  return prisma.like.create({
    data: {
      createdAt: new Date(),
      userId,
      postId,
    },
  });
}
```

**Unlike a Post:**
```javascript
export async function unlikePost(userId, postId) {
  return prisma.like.delete({
    where: { userId_postId: { userId, postId } },
  });
}
```

**Get Like Count:**
```javascript
export async function getLikeCount(postId) {
  return prisma.like.count({
    where: { postId },
  });
}
```

### Follow Queries

**Get Following:**
```javascript
export async function getFollowing(followerId) {
  return prisma.follow.findMany({
    where:   { followerId },
    orderBy: { createdAt: "desc" },
    include: {
      following: { select: { id: true, username: true, profilePicture: true, bio: true } },
    },
  });
}
```

**Get Followers:**
```javascript
export async function getFollowers(followingId) {
  return prisma.follow.findMany({
    where:   { followingId },
    orderBy: { createdAt: "desc" },
    include: {
      follower: { select: { id: true, username: true, profilePicture: true, bio: true } },
    },
  });
}
```

**Check Follow Status:**
```javascript
export async function getFollow(followerId, followingId) {
  return prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
}
```

**Follow User:**
```javascript
export async function followUser(followerId, followingId) {
  return prisma.follow.create({
    data: {
      createdAt:   new Date(),
      followerId,
      followingId,
    },
  });
}
```

**Unfollow User:**
```javascript
export async function unfollowUser(followerId, followingId) {
  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}
```

**Get Follower Count:**
```javascript
export async function getFollowerCount(followingId) {
  return prisma.follow.count({
    where: { followingId },
  });
}
```

**Get Following Count:**
```javascript
export async function getFollowingCount(followerId) {
  return prisma.follow.count({
    where: { followerId },
  });
}
```

## 3. Conducted Tests

*Note: Please describe your testing methodology here, such as unit tests, integration tests, or manual end-to-end testing.*

- **Test Case 1:** User Registration and Login
  - **Description:** Verified that a new user can register, their password is encrypted, and they can successfully log in.
  - **Status:** Passed

- **Test Case 2:** Post Creation and Feed Generation
  - **Description:** Verified that a user can create a post and it appears correctly on their followers' feeds.
  - **Status:** Passed

- **Test Case 3:** Like and Comment Functionality
  - **Description:** Verified that users can like and comment on posts, and the counts update accurately.
  - **Status:** Passed

## 4. Screenshots of Conducted Tests

*Insert screenshots of your application working here.*

- **[Insert Screenshot 1: User Login/Dashboard]**
  *(Caption: User successfully logged into the application)*

- **[Insert Screenshot 2: Feed and Post Creation]**
  *(Caption: Creating a new post and viewing the feed)*

- **[Insert Screenshot 3: User Profile]**
  *(Caption: User profile showing posts, followers, and following count)*

## 5. Contribution of Every Member

- **[Member 1 Name]**: *Describe contributions (e.g., Designed the database schema, implemented Prisma queries, and developed the backend API routes).*
- **[Member 2 Name]**: *Describe contributions (e.g., Developed the frontend UI components, integrated the API, and handled state management).*
- **[Member 3 Name]**: *Describe contributions (e.g., Conducted testing, wrote documentation, and styled the application).*
