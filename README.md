# Real-Time Chat Application

A simple real-time chat application built with React, TypeScript, and Socket.IO.

## Features

- Basic authentication system (username-based)
- Multiple chat rooms
- Real-time messaging
- Display of active users in each room
- Room creation and joining functionality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start both the client and server:
   ```bash
   npm run dev
   ```
   This will start:
   - Frontend client at http://localhost:5173
   - Backend server at http://localhost:3001

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
│   ├── Login.tsx   # Login page
│   ├── ChatRooms.tsx   # Room listing page
│   └── ChatRoom.tsx    # Chat room page
├── services/       # Services (Socket.IO, etc.)
└── App.tsx         # Main application component
```

## Technical Decisions

- Used **Vite** as the build tool for fast development and optimized production builds
- Implemented Socket.IO for real-time communication
- Used React Router for client-side routing
- Maintained a clean architecture with separate components for different features
- Used TypeScript for better type safety and development experience

## Future Improvements

- Add user authentication with JWT
- Implement persistent chat history
- Add private messaging functionality
- Add file sharing capabilities
- Implement user profiles with avatars
- Add message reactions and threading
- Implement room moderation features
