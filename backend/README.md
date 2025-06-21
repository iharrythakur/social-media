# Social Media Platform - Backend

Flask-based REST API for the social media platform with Firebase authentication and Supabase database.

## Features

- **User Authentication**: Firebase Auth integration with JWT tokens
- **User Management**: Create, read, and update user profiles
- **Post Management**: Create posts, view global feed, and user-specific posts
- **Post Reactions**: Like posts multiple times (Medium's Clap feature)
- **Database**: PostgreSQL with Supabase
- **Security**: JWT-based authentication, input validation, CORS

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL database (Supabase recommended)
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Create virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

5. **Initialize database**

   ```bash
   python run.py
   ```

6. **Run the application**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

## Environment Variables

| Variable                   | Description                                | Required |
| -------------------------- | ------------------------------------------ | -------- |
| `FLASK_APP`                | Flask application entry point              | Yes      |
| `FLASK_ENV`                | Flask environment (development/production) | Yes      |
| `SECRET_KEY`               | Flask secret key                           | Yes      |
| `JWT_SECRET_KEY`           | JWT token secret key                       | Yes      |
| `DATABASE_URL`             | PostgreSQL connection string               | Yes      |
| `FIREBASE_PROJECT_ID`      | Firebase project ID                        | Yes      |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON              | Yes      |

## API Endpoints

### Authentication

#### `POST /api/auth/register`

Register a new user with Firebase authentication.

**Request Body:**

```json
{
  "id_token": "firebase-id-token",
  "name": "John Doe",
  "bio": "Software developer",
  "profile_picture_url": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "firebase_uid": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "access_token": "jwt-token"
}
```

#### `POST /api/auth/login`

Login user with Firebase authentication.

**Request Body:**

```json
{
  "id_token": "firebase-id-token"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "firebase_uid": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "access_token": "jwt-token"
}
```

#### `GET /api/auth/profile`

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "firebase_uid": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Users

#### `GET /api/users/<user_id>`

Get user profile by ID.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "firebase_uid": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

#### `PUT /api/users/<user_id>`

Update user profile (requires authentication, can only update own profile).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "John Smith",
  "bio": "Updated bio",
  "profile_picture_url": "https://example.com/new-avatar.jpg"
}
```

**Response:**

```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "firebase_uid": "firebase-uid",
    "name": "John Smith",
    "email": "john@example.com",
    "bio": "Updated bio",
    "profile_picture_url": "https://example.com/new-avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Posts

#### `GET /api/posts`

Get all posts with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 20, max: 100)

**Response:**

```json
{
  "posts": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "content": "Hello world!",
      "image_url": "https://example.com/image.jpg",
      "likes_count": 5,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "user_name": "John Doe",
      "user_profile_picture": "https://example.com/avatar.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "offset": 0
  }
}
```

#### `POST /api/posts`

Create a new post (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "content": "Hello world!",
  "image_url": "https://example.com/image.jpg"
}
```

**Response:**

```json
{
  "message": "Post created successfully",
  "post": {
    "id": "uuid",
    "user_id": "user-uuid",
    "content": "Hello world!",
    "image_url": "https://example.com/image.jpg",
    "likes_count": 0,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "user_name": "John Doe",
    "user_profile_picture": "https://example.com/avatar.jpg"
  }
}
```

#### `PUT /api/posts/<post_id>/like`

Like a post (Medium's Clap feature - can like multiple times).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "message": "Post liked successfully",
  "post": {
    "id": "uuid",
    "user_id": "user-uuid",
    "content": "Hello world!",
    "image_url": "https://example.com/image.jpg",
    "likes_count": 6,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "user_name": "John Doe",
    "user_profile_picture": "https://example.com/avatar.jpg"
  }
}
```

#### `GET /api/posts/user/<user_id>`

Get all posts by a specific user.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Posts per page (default: 20, max: 100)

**Response:**

```json
{
  "posts": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "content": "Hello world!",
      "image_url": "https://example.com/image.jpg",
      "likes_count": 5,
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "user_name": "John Doe",
      "user_profile_picture": "https://example.com/avatar.jpg"
    }
  ],
  "user": {
    "id": "uuid",
    "firebase_uid": "firebase-uid",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "offset": 0
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Testing

Run tests with pytest:

```bash
python -m pytest
```

## Deployment

### Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in Render dashboard
4. Deploy

### Heroku

1. Create a Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy with Git

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    profile_picture_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Posts Table

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
