import React, { useEffect } from "react";
import axios from "axios";

function Post() {
  const postUsers = async () => {
    const response = await axios.post("http://localhost:8000/users", {
      id: 11,
      username: "Rki0",
      name: "Pak Ki-young",
    });

    console.log("Post", response.data);
  };

  useEffect(() => {
    postUsers();
  }, []);

  return <></>;
}

export default Post;
