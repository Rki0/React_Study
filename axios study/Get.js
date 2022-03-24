import React, { useEffect, useState } from "react";
import axios from "axios";

function Get() {
  const [users, setUsers] = useState(null);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    setUsers(null);
    setError(null);
    setLoad(true);

    const response = await axios.get("http://localhost:8000/users");

    setUsers(response.data);

    setLoad(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (load) return <div>Loading...</div>;
  if (error) return <div>Error!!!</div>;
  if (!users) return null;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={getUsers}>ReLoad</button>
    </>
  );
}

export default Get;
