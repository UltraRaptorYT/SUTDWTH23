import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCamera,
  faBagShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 720,
  height: 960,
  facingMode: "user",
};

function Home() {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState();
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    setImageSrc(webcamRef.current.getScreenshot());
    console.log(imageSrc);
  }, [webcamRef]);

  const headerHeight = 70;
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

  return (
    <main className="flex flex-col h-[100svh]">
      <Header className={`h-[${headerHeight}px]`} />
      <div style={{ marginTop: headerHeight + "px" }}>
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full max-w-[400px] mx-auto aspect-[3/4] max-h-[calc(100svh-70px-75px-100px)]"
          />
          <div className="text-3xl">This is the home page. {data}</div>
          <img src={imageSrc} />
        </div>
      </div>
      <footer className="w-screen h-[75px] pt-[20px] mt-auto">
        <div className="bg-red-500 h-full border-t-4 border-black text-xl relative flex items-center">
          <div className="flex items-center justify-around h-full w-full max-w-[400px] mx-auto p-2">
            <button className="aspect-square w-[50px]">
              <FontAwesomeIcon icon={faUtensils} />
            </button>
            <button className="aspect-square w-[50px]">
              <FontAwesomeIcon icon={faBagShopping} />
            </button>
            <div className="self-start relative w-[65px] -translate-y-1/2">
              <button
                onClick={capture}
                className="w-full aspect-square flex bg-blue-500 rounded-full p-2 border-4 border-black items-center justify-center"
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>
            <button className="aspect-square w-[50px]">
              <FontAwesomeIcon icon={faUtensils} />
            </button>
            <button
              className="aspect-square w-[50px]"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
