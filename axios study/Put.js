import React, { useEffect } from "react";
import axios from "axios";

function Put() {
  const putUsers = async () => {
    const response = await axios.put("http://localhost:8000/users/11", {
      id: 11,
      username: "tolip",
      name: "R",
    });

    console.log(response.data);
  };

  useEffect(() => {
    putUsers();
  }, []);

  return <></>;
}

export default Put;
