# ShopMate - Smart Shopping List App 🛒

ShopMate is a modern, feature-rich shopping list application designed to help users organize their grocery trips efficiently. It allows users to create multiple lists, add items with categories and quantities, and track what they've bought.

## ✨ Features

-   **User Authentication**: Secure Login and Registration system.
-   **Multiple Lists**: Create, rename, and delete shopping lists.
-   **Item Management**:
    -   Add items with details (Quantity, Category).
    -   **Edit** items (update name, quantity, category).
    -   **Delete** items.
    -   **Search** and **Sort** items within a list.
-   **Smart Search**: Filter your lists instantly from the home page.
-   **Responsive Design**: A premium, mobile-friendly UI built with Tailwind CSS.

## 🛠️ Tech Stack

This project is built using the latest web technologies:

-   **Frontend**: [React 19](https://react.dev/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Routing**: [React Router DOM](https://reactrouter.com/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
-   **Backend (Mock)**: [JSON Server](https://github.com/typicode/json-server) (serves as a full fake REST API)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 How to Run the App

To run this application locally, you will need **Node.js** installed on your machine.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shopping_list
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

You need to run **two separate terminals** to start the app (one for the backend, one for the frontend).

**Terminal 1: Start the Mock Backend**
This runs the JSON server on port 3000 to handle data persistence.
```bash
npm run server
```

**Terminal 2: Start the Frontend**
This runs the Vite development server.
```bash
npm run dev
```

Open your browser and navigate to the URL shown in Terminal 2 (usually `http://localhost:5173`).

## 🔑 Demo Credentials

To test the app quickly without registering, you can use the following test account:

-   **Email**: `anele@gmail.com`
-   **Password**: `123456`

*Alternatively, feel free to click "Register" on the login page to create your own account!*

## 📁 Project Structure

-   `src/components`: Reusable UI components (Card, Navbar, ViewItems).
-   `src/features`: Redux slices for state management (Login, Lists).
-   `src/pages`: Main page views (Login, Home, Register).
-   `src/routes`: App routing configuration.
-   `src/store`: Redux store configuration.
-   `db.json`: The database file for JSON Server.
