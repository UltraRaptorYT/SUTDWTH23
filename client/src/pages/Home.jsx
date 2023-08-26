import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Webcam from "react-webcam";
import Footer from "../components/Footer";
import CamButton from "../components/CamButton";

const videoConstraints = {
  width: 720,
  height: 960,
  facingMode: "user",
};

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    let userid = localStorage.getItem("userid");
    if (!userid) {
      navigate("/login");
    }
  }, []);

  const [imageSrc, setImageSrc] = useState();
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    setImageSrc(webcamRef.current.getScreenshot());
    console.log(imageSrc);
  }, [webcamRef]);

  const headerHeight = 75;
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   // // Make a GET request using Axios
  //   // axios
  //   //   .post("http://127.0.0.1:8000/generate", { input: "KALEB" })
  //   //   .then((response) => {
  //   //     setData(response.data.video);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error fetching data:", error);
  //   //   });
  // }, []); // The empty dependency array ensures this effect runs only once after the initial render

  return (
    <main className="flex flex-col h-[100svh]">
      <Header headerHeight={headerHeight} />
      <div
        style={{ marginTop: headerHeight + "px" }}
        className="grow flex items-center justify-center"
      >
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full max-w-[400px] mx-auto aspect-[3/4] max-h-[calc(100svh-70px-75px)]"
          />
          <img src={imageSrc} />
        </div>
      </div>
      <Footer>
        <CamButton onClick={capture} />
      </Footer>
    </main>
  );
}

export default Home;
