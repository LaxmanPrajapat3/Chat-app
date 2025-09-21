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
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link> |{" "}
        {user && <button onClick={logout}>Logout</button>}
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
