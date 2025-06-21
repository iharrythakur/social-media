# Social Media Platform - Frontend

React.js frontend for the social media platform with Firebase authentication and modern UI/UX.

## Features

- **User Authentication**: Firebase Auth with email/password and Google sign-in
- **User Profiles**: View and edit personal profiles
- **Post Creation**: Create text posts with optional images
- **Global Feed**: View posts from all users with pagination
- **Post Reactions**: Like posts multiple times (Medium's Clap feature)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Instant feedback for user actions
- **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Firebase Auth** - Authentication service
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Backend API running

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
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

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Environment Variables

| Variable                                 | Description                  | Required |
| ---------------------------------------- | ---------------------------- | -------- |
| `REACT_APP_API_URL`                      | Backend API URL              | Yes      |
| `REACT_APP_FIREBASE_API_KEY`             | Firebase API key             | Yes      |
| `REACT_APP_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain         | Yes      |
| `REACT_APP_FIREBASE_PROJECT_ID`          | Firebase project ID          | Yes      |
| `REACT_APP_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket      | Yes      |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes      |
| `REACT_APP_FIREBASE_APP_ID`              | Firebase app ID              | Yes      |

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── CreatePost.js   # Post creation form
│   ├── LoadingSpinner.js # Loading indicator
│   ├── Navbar.js       # Navigation bar
│   └── PostCard.js     # Individual post display
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Home.js         # Main feed page
│   ├── Login.js        # Login page
│   ├── Profile.js      # User profile page
│   ├── Register.js     # Registration page
│   └── UserProfile.js  # Other user's profile
├── services/           # API services
│   └── api.js          # API client and endpoints
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## Components

### Authentication Components

#### Login Page (`/login`)

- Email/password authentication
- Google sign-in
- Form validation
- Error handling

#### Register Page (`/register`)

- User registration with email/password
- Google sign-up
- Profile information collection
- Password confirmation

### Main Components

#### Home Page (`/`)

- Global post feed
- Post creation form
- Infinite scroll pagination
- Real-time like updates

#### Profile Page (`/profile`)

- User profile display
- Profile editing
- Member information
- Profile picture management

#### User Profile Page (`/user/:userId`)

- Other users' profiles
- User's posts feed
- Profile information display

### Reusable Components

#### CreatePost

- Post creation form
- Image URL input
- Character counter
- Form validation

#### PostCard

- Post display
- Like functionality (Medium's Clap)
- User information
- Image display
- Timestamp formatting

#### Navbar

- Navigation links
- User menu
- Mobile responsive
- Logout functionality

## Features in Detail

### Authentication

- **Firebase Integration**: Secure authentication with Firebase Auth
- **Multiple Sign-in Methods**: Email/password and Google OAuth
- **JWT Tokens**: Automatic token management
- **Protected Routes**: Route protection based on authentication status

### Post System

- **Text Posts**: Create posts with up to 1000 characters
- **Image Support**: Add images via URL
- **Like System**: Like posts multiple times (Medium's Clap)
- **Real-time Updates**: Instant feedback for actions
- **Pagination**: Load more posts with infinite scroll

### User Profiles

- **Profile Management**: Edit name, bio, and profile picture
- **Public Profiles**: View other users' profiles
- **Post History**: View user's posts
- **Member Information**: Join date and profile details

### UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Styling**: Clean, professional design with Tailwind CSS
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Loading spinners and skeleton screens
- **Toast Notifications**: Success and error feedback
- **Form Validation**: Real-time validation and error messages

## Styling

The application uses Tailwind CSS for styling with custom components:

### Custom Classes

- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.btn-outline` - Outline button styling
- `.input-field` - Form input styling
- `.card` - Card container styling
- `.post-card` - Post card styling
- `.like-button` - Like button styling
- `.avatar` - Avatar image styling

### Color Scheme

- **Primary**: Blue shades (#3B82F6 to #1E3A8A)
- **Secondary**: Gray shades (#F8FAFC to #0F172A)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

## State Management

The application uses React Context for state management:

### AuthContext

- User authentication state
- Login/logout functions
- Profile management
- Token handling

### Local State

- Component-specific state
- Form data
- Loading states
- Error handling

## API Integration

The frontend communicates with the backend through a centralized API service:

### API Service Features

- **Axios Instance**: Configured with base URL and interceptors
- **Authentication**: Automatic token inclusion in requests
- **Error Handling**: Centralized error handling and token refresh
- **Endpoint Organization**: Grouped by functionality

### API Endpoints Used

- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Posts: `/api/posts/*`

## Performance Optimizations

- **Code Splitting**: React Router lazy loading
- **Image Optimization**: Lazy loading and error handling
- **Pagination**: Efficient data loading
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Tree shaking and code splitting

## Testing

Run tests with:

```bash
npm test
```

## Building for Production

```bash
npm run build
```

The build output will be in the `build/` directory.

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

### Manual Deployment

1. Build the application: `npm run build`
2. Upload the `build/` directory to your hosting service
3. Configure environment variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Firebase Configuration**: Ensure all Firebase environment variables are set correctly
2. **API Connection**: Verify the backend is running and accessible
3. **CORS Issues**: Check backend CORS configuration
4. **Authentication**: Clear localStorage if authentication issues persist

### Development Tips

- Use React Developer Tools for debugging
- Check browser console for errors
- Verify API responses in Network tab
- Test on different screen sizes for responsiveness
