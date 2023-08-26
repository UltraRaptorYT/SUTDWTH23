import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCamera,
  faBagShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Footer() {
  // New navigator object
  const navigate = useNavigate();
  return (
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
              onClick={() => {
                navigate("/");
              }}
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
  );
}

export default Footer;
