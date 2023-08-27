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

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    var userid = localStorage.getItem("userid");
    if (!userid) {
      navigate("/login");
    }
  }, []);

  const [imageSrc, setImageSrc] = useState();
  const webcamRef = useRef(null);
  const capture = useCallback(async () => {
    setImageSrc(webcamRef.current.getScreenshot());
    processImage(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    if (imageSrc) {
      processImage(imageSrc);
    }
  }, [imageSrc]);

  const BASE_URL2 = "https://docker-test-shec.onrender.com";
  function processImage(image) {
    if (image) {
      const imageData = image.split("base64,")[1];
      console.log(imageData);
      axios
        .post("http://213.108.196.111:1715/invocations", {
          image: imageData,
        })
        .then((res) => {
          console.log(res);
          axios({
            method: "post",
            url: `${BASE_URL2}/expire`,
            headers: {},
            data: {
              input: JSON.stringify(res.data),
            },
          })
            .then(async (res) => {
              console.log(res.data);
              if ("list_of_ingrediants" in res.data) {
                for await (let ingredient of res.data["list_of_ingrediants"]) {
                  console.log(ingredient);
                  var { data, error } = await supabase
                    .from("food")
                    .select("*")
                    .eq("name", ingredient["base_name"]);
                  console.log(data);
                  if (data.length == 0) {
                    var { data, error } = await supabase
                      .from("food")
                      .insert({
                        name: ingredient["base_name"],
                      })
                      .select("*");
                    var { data, error } = await supabase
                      .from("user_food")
                      .insert({
                        userId: localStorage.getItem("userid"),
                        foodId: data[0].id,
                        quantity: ingredient["Quantity"],
                        expires_in: ingredient["Days_to_expire"],
                      })
                      .select("*");
                  } else {
                    var { data, error } = await supabase
                      .from("user_food")
                      .insert({
                        userId: localStorage.getItem("userid"),
                        foodId: data[0].id,
                        quantity: ingredient["Quantity"],
                        expires_in: ingredient["Days_to_expire"],
                      })
                      .select("*");
                  }
                  alert("Scan Completed!");
                  navigate("/inventory");
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const headerHeight = 75;

  return (
    <main className="flex flex-col h-[100svh]">
      <Header headerHeight={headerHeight} />
      <div
        style={{ marginTop: headerHeight + "px" }}
        className="grow flex items-center justify-start max-h-[calc(100svh-75px-75px)] flex-col py-2"
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full max-w-[400px] mx-auto aspect-[3/4] max-h-[calc(100svh-75px-75px-16px)] grow"
        />
        {/* <img src={imageSrc} /> */}
      </div>
      <Footer>
        <CamButton onClick={capture} />
      </Footer>
    </main>
  );
}

export default Home;
