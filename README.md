# Jeoparty API

A robust backend for the Jeoparty game, built with the NestJS framework. This API handles game logic, real-time communication via WebSockets, and persistent storage for questions, categories, and users.

## 🚀 Technologies

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-time:** [Socket.io](https://socket.io/) (WebSockets)
- **Language:** TypeScript

## 🏗️ Architecture

The API is organized into several core modules:

- **Users Module:** Handles user registration and authentication (using `bcrypt` for password hashing).
- **Categories Module:** Manages the various trivia categories available in the game.
- **Questions Module:** Manages the questions (clues) associated with each category.
- **Game Sessions Module:** The core of the game logic. It manages active room states, player joining/scores, and game flow transitions.
- **Game Gateway:** A centralized WebSocket gateway that emits and listens for game events like `buzz`, `open_question`, `reveal_answer`, etc.

## 🛠️ Setup & Installation

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb://your-mongodb-uri/jeopardy
   ```

## 🎮 Running the Project

```bash
# Development mode
npm run start:dev

# Seed the database (categories and questions)
npm run seed

# Production mode
npm run start:prod
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📜 License

This project is [UNLICENSED](LICENSE).
