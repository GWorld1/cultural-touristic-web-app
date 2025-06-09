# Cultural Touristic Web App

A modern web application for sharing and discovering cultural and touristic experiences through 360° panoramic photography.

## Features

- **Authentication System**: Complete user registration, login, and session management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with Radix UI components and Lucide icons
- **Route Protection**: Secure pages with authentication middleware
- **360° Tourism Focus**: Designed specifically for panoramic travel photography

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand (for authentication)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication

The app includes a complete authentication system with:

- User registration and login
- Password reset functionality
- Protected routes with middleware
- Session management with JWT tokens
- Responsive auth forms

**Demo Credentials:**
- Email: `demo@example.com`
- Password: `password123`

## Project Structure

```
app/
├── auth/                 # Authentication pages
├── api/auth/            # Authentication API routes
├── (protected pages)    # Main app pages
components/
├── auth/                # Auth-related components
├── ui/                  # Reusable UI components
lib/
├── api/                 # API services
├── contexts/            # React contexts
├── stores/              # State management
└── types/               # TypeScript definitions
```

## Development

This is a UI-focused application with working authentication. The main pages (home, upload, search, profile) currently display static demonstrations of the intended functionality, providing a solid foundation for implementing backend features.

## Documentation

- [Authentication Guide](./AUTHENTICATION_README.md) - Detailed authentication implementation guide

## License

This project is for educational and development purposes.
