# Poll Backend Setup

This repository contains the backend for a Polling Application built with Node.js, Express, MongoDB, and Socket.io for real-time updates.

## Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js** (v22.8 or later)
- **MongoDB** (make sure the MongoDB server is running locally or provide a MongoDB Atlas URI)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone the Repository
git clone https://github.com/yourusername/poll-backend.git
cd poll-backend

### 2. Install Dependencies
npm install

### 3. Create a .env File in config/config.env

PORT=4000
MONGODB_URI=mongodb://localhost:27017/dbname
JWT_SECRET=your_jwt_secret

### 4. Start the Server
npm run dev

The server should start on http://localhost:4000.

