import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users
          .filter((u) => u._id !== user._id) // hide logged-in user
          .map((u) => (
            <li key={u._id} onClick={() => onSelectUser(u)}>
              {u.name} ({u.email})
            </li>
          ))}
      </ul>
    </div>
  );
}
