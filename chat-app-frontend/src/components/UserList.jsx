// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";

// export default function UserList({ onSelectUser }) {
//   const [users, setUsers] = useState([]);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: token },
//       });
//       setUsers(res.data);
//     };
//     fetchUsers();
//   }, []);

//   return (
//     <div>
//       <h3>Users</h3>
//       <ul>
//         {users
//           .filter((u) => u._id !== user._id) // hide logged-in user
//           .map((u) => (
//             <li key={u._id} onClick={() => onSelectUser(u)}>
//               {u.name} ({u.email})
//             </li>
//           ))}
//       </ul>
//     </div>
//   );
// }


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
    <div className="w-full md:w-1/3 bg-white shadow-lg border-r border-gray-200 h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 shadow">
        <h3 className="text-lg font-semibold">Users</h3>
      </div>

      {/* Users List */}
      <ul className="divide-y divide-gray-200">
        {users
          .filter((u) => u._id !== user._id) // hide logged-in user
          .map((u) => (
            <li
              key={u._id}
              onClick={() => onSelectUser(u)}
              className="p-4 cursor-pointer hover:bg-purple-100 transition flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium text-gray-800">{u.name}</span>
              <span className="text-sm text-gray-500">{u.email}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
