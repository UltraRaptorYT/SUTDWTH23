import { useNavigate } from "react-router-dom";
import React from "react";

function Header({ className }) {
  const navigate = useNavigate();
  const imgUrl = new URL("/images/mascot.png", import.meta.url).href;
  return (
    <header
      className={`fixed ${className} w-full bg-pink-100 flex items-center px-5`}
    >
      <div className="flex w-full max-w-[400px] mx-auto items-center">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="flex items-center"
        >
          <img src={imgUrl} className="w-14 aspect-square" />
          <p className="font-bold text-base">SustainaBite</p>
        </button>
      </div>
    </header>
  );
}

export default Header;
