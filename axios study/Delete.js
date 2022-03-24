import axios from "axios";
import { useEffect } from "react";

function Delete() {
  const deleteUsers = async () => {
    const response = await axios.delete("http://localhost:8000/users/11", {
      id: 11,
    });

    console.log(response.log);
  };

  useEffect(() => {
    deleteUsers();
  }, []);

  return <></>;
}

export default Delete;
