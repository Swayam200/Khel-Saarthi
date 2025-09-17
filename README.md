# Khel Saarthi - Your Sport, Your Community

Khel Saarthi is a mobile-first platform designed to solve the fragmentation in India's local sports ecosystem. It serves as a single, unified hub that connects athletes with organizers, making it easy to discover, join, and manage sporting events.

## Features Implemented

- **Full User Authentication:** Secure user registration and login for "participant" and "host" roles.
- **Persistent Login:** The app remembers the user's session, providing a seamless experience upon reopening.
- **Event Creation (Hosts):** Logged-in hosts can create new sporting events.
- **Event Discovery:** The home screen fetches and displays a list of all available events.

## Screenshots

<details>
  <summary>Click to view screenshots</summary>

  ### Login Page
  ![Login Page](<frontend/project_screenshots/Login Page.jpeg>)

  ### Register Page
  ![Register Page](<frontend/project_screenshots/Register Page.jpeg>)

  ### User Home Page
  ![User Home Page](<frontend/project_screenshots/User Home Page.jpeg>)

  ### Host Home Page
  ![Host Home Page](<frontend/project_screenshots/Host Home Page.jpeg>)
</details>

## Tech Stack

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT)

### Frontend
- **Framework:** React Native with Expo
- **State Management:** React Context API
- **Navigation:** React Navigation
- **API Client:** Axios
- **Persistent Storage:** AsyncStorage

---

## Getting Started

Just run the following in root folder
```
 npm run dev
``` 
### Ignore these  

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites
You will need the following software installed:
 - [Node.js](https://nodejs.org/) (which includes npm) ** Ignore this **
- The [Expo Go](https://expo.dev/go) app on your mobile phone

### Backend Setup

1.  **Clone the repository** (or if you already have it, navigate to the root `khel-saarthi` folder).

2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Create your environment file:**
    Ask @Swayam200 (i.e., me) for the `.env` file. The `PORT` should preferably be kept as `5001`.
    .env file you have to place inside backend/  

5.  **Run the server:**
    ```bash
    node server.js
    ```
    The backend server should now be running on `http://localhost:5001`.

### Frontend Setup

1.  **Navigate to the `frontend` directory in a new terminal window:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the app:**
    ```bash
    npx expo start
    ```
4.  **Scan the QR code** shown in the terminal using the Expo Go app on your phone.
