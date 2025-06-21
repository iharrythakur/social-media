# Social Media Platform

A simplified social media platform built with React.js frontend and Flask backend, featuring user authentication, profiles, posts, and reactions.

## 🚀 Features

### Core Features

- **User Authentication**: Secure login and signup using Firebase Auth
- **User Profiles**: Create and update profiles with name, profile picture, and bio
- **Post Creation**: Create and publish text posts and images
- **Global Feed**: View posts from all users in a chronological feed
- **Post Reactions**: Like posts multiple times (similar to Medium's Clap feature)

### Technical Features

- Responsive design for mobile and desktop
- Real-time updates
- Secure API endpoints
- Cloud database integration

## 🛠️ Tech Stack

### Frontend

- **React.js** - User interface framework
- **Firebase Auth** - Authentication service
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework

### Backend

- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-JWT-Extended** - JWT token management
- **SQLAlchemy** - Database ORM

### Database

- **Supabase (PostgreSQL)** - Cloud database service

### Storage

- **Firebase Storage** - Image upload and storage

## 📁 Project Structure

```
social-media-platform/
├── frontend/                 # React.js frontend
│   ├── public/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   ├── package.json
│   └── README.md
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── requirements.txt
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Firebase account
- Supabase account

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd social-media-platform/backend
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
   Create a `.env` file in the backend directory:

   ```env
   FLASK_APP=app
   FLASK_ENV=development
   SECRET_KEY=your-secret-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-anon-key
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```

5. **Run the backend**
   ```bash
   flask run
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:

   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the frontend**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Enable Storage for image uploads
4. Get your Firebase configuration

### Supabase Setup

1. Create a new Supabase project
2. Get your project URL and anon key
3. Create the required tables (see database schema below)

## 📊 Database Schema

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

## 🚀 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy the backend service

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy the frontend application

## 🧪 Testing

### Backend Tests

```bash
cd backend
python -m pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### User Endpoints

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Post Endpoints

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id/like` - Like a post

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Image upload size limit: 5MB per image
- Maximum post length: 1000 characters
- Rate limiting: 100 requests per minute per user

## 📞 Support

For support, email support@socialmediaplatform.com or create an issue in the repository.
