# RiseUp-Alpha

<div align="center">
  <img src="./frontend/src/assets/logo/ru-logo-w.png" alt="RiseUp Logo" width="200">
  <p><em>An AI-powered chat assistant with context awareness</em></p>
</div>

## 📋 Overview

RiseUp-Alpha is a modern web application that provides an AI chat assistant powered by the DeepSeek API. The application allows users to interact with an AI assistant that can provide context-aware responses based on information stored in the system.

## ✨ Features

- **Context-Aware AI Responses**: Utilizes data from text files to provide informed answers
- **Real-time Chat Interface**: Modern and responsive UI for seamless interaction
- **Markdown Support**: Renders AI responses with proper formatting including tables and code blocks
- **Streaming Responses**: Delivers AI responses in real-time as they're generated

## 🛠️ Technology Stack

### Frontend
- **React 19**: UI library for building the user interface
- **Vite**: Next-generation frontend tooling for faster development
- **Axios**: Promise-based HTTP client for API requests
- **React Markdown**: Renders markdown content in the chat interface
- **Lottie React**: Adds engaging animations to the UI

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for handling HTTP requests
- **Axios**: Used for making API calls to DeepSeek
- **Dotenv**: Manages environment variables
- **CORS**: Enables cross-origin resource sharing
- **FS-Extra**: Enhanced file system methods

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- DeepSeek API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/RiseUp-Alpha.git
   cd RiseUp-Alpha
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with your DeepSeek API key:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   PORT=5000
   ```

4. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## 🖥️ Running the Application

### Start the Backend Server

```bash
cd backend
npm start
```

The server will start on http://localhost:5000

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173

## 📊 Project Structure

```
RiseUp-Alpha/
├── backend/               # Node.js server
│   ├── data/              # Context data files (.txt)
│   └── server.js          # Express server implementation
└── frontend/              # React application
    ├── public/            # Static assets
    └── src/               # Source code
        ├── assets/        # Images, animations, etc.
        ├── App.jsx        # Main application component
        └── main.jsx       # Application entry point
```

## 🧩 Adding Context Data

To add new context data for the AI assistant:

1. Create a new `.txt` file in the `backend/data/` directory
2. Add your content to the file
3. Restart the backend server

The application will automatically load all `.txt` files from the data directory and use their content as context for AI responses.

## 🔧 Customization

- Modify the system prompt in `backend/server.js` to change the AI's behavior
- Update the UI styling in `frontend/src/App.css`
- Add new animations or assets in the `frontend/src/assets/` directory

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">
  <p>Built with ❤️ by the RiseUp Team</p>
</div>
