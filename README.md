# Khel Saarthi - Your Sport, Your Community
Khel Saarthi is a mobile-first platform designed to solve the fragmentation in India's local sports ecosystem. It serves as a single, unified hub that connects athletes with organizers, making it easy to discover, join, and manage sporting events.

## Tech Stack (Backend)
Framework: Node.js with Express.js
Database: MongoDB with Mongoose
Authentication: JSON Web Tokens (JWT)
Environment: Node.js

## Getting Started
Follow these instructions to get the backend server up and running on your local machine for development and testing.

### Prerequisites  
You will need the following software installed on your machine:

- Node.js (which includes npm)
- A free MongoDB Atlas account

#### Backend Setup
Clone the repository (or if you already have it, navigate to the root khel-saarthi folder).

Navigate to the backend directory:

```
cd backend
```
Install dependencies:

```
npm install
```

Create your environment file:  
Create a new file named .env inside the backend folder. Copy the contents of the .env.example below into it.

#### Ask @Swayam200 i.e. me for the .env file

The port your server will run on (use 5001 or another free port)
PORT=5001
Preferably keep it 5001 only. Don't change it unless necessary.

Get your MONGO_URI from your MongoDB Atlas dashboard and replace the placeholder in your .env file.

Run the server:

node server.js

The server should now be running on the port you specified (e.g., http://localhost:5001).