import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
import { AuthContext } from "./context/AuthContext";


export default function App() {
  const { user, logout } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Router>
      {/* <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link> |{" "}
        {user && <button onClick={logout}>Logout</button>}
      </nav> */}
 <nav className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      {/* Logo / Brand */}
      <div className="text-lg font-bold tracking-wide">ChatApp</div>

      {/* Links */}
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="bg-white text-pink-500 hover:bg-pink-100 px-3 py-1 rounded-md font-medium transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-white text-purple-500 hover:bg-purple-100 px-3 py-1 rounded-md font-medium transition"
        >
          Signup
        </Link>
        {user && (
          <button
            onClick={logout}
            className="bg-white text-indigo-500 hover:bg-indigo-100 px-3 py-1 rounded-md font-medium transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/chat" />} />
        <Route
          path="/chat"
          element={
            user ? (
              <div style={{ display: "flex" }}>
                <UserList onSelectUser={setSelectedUser} />
                {selectedUser && <Chat selectedUser={selectedUser} />}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
