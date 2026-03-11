# Social Media Platform --- Data Model (MD Schema)

## 1. Overview

This document defines the data structure (schema) for our Social Media
Platform project.

All application data is stored in the browser using localStorage in JSON
format.

------------------------------------------------------------------------

## 2. Database Root Object

``` json
socialDB = {
  "users": [],
  "posts": [],
  "currentUser": null
}
```

------------------------------------------------------------------------

## 3. Users Schema

``` json
User = {
  "id": "",
  "username": "",
  "email": "",
  "password": "",
  "profilePic": "",
  "bio": "",
  "followers": [],
  "following": [],
  "createdAt": ""
}
```

- **followers** / **following**: Arrays of user IDs (strings). When implementing follow/unfollow, update **both** users: add/remove the other user's ID in each user's array to keep data consistent.

------------------------------------------------------------------------

## 4. Posts Schema

``` json
Post = {
  "id": "",
  "authorId": "",
  "content": "",
  "createdAt": "",
  "likes": [],
  "comments": []
}
```

- **likes**: Array of user IDs (strings). Use for like count (`likes.length`) and to check if the current user has liked the post (e.g. toggle like button state).

------------------------------------------------------------------------

## 5. Comment Schema

``` json
Comment = {
  "id": "",
  "userId": "",
  "text": "",
  "createdAt": ""
}
```

------------------------------------------------------------------------

## 6. Authentication State

Stores which user is currently logged in.

``` json
"currentUser": "u_001"
```

------------------------------------------------------------------------

## End of Document
