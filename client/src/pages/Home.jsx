import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Make a GET request using Axios
    axios
      .post("http://127.0.0.1:8000/generate", { input: "KALEB" })
      .then((response) => {
        setData(response.data.video);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  return <div className="text-3xl">This is the home page. {data}</div>;
}

export default Home;
