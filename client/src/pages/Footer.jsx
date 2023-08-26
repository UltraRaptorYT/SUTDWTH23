import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faCamera,
  faBoxesStacked,
  faUser,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

function Footer({ children }) {
  // New navigator object
  const navigate = useNavigate();

  useEffect(() => {
    let userid = localStorage.getItem("userid");
    if (!userid) {
      navigate("/login");
    }
  }, []);

  return (
    <footer className="w-screen h-[75px] pt-[20px] mt-auto">
      <div className="bg-red-500 h-full border-t-4 border-black text-xl relative flex items-center">
        <div className="flex items-center justify-around h-full w-full max-w-[400px] mx-auto p-2">
          <button className="aspect-square w-[50px]">
            <FontAwesomeIcon icon={faUtensils} />
          </button>
          <button
            className="aspect-square w-[50px]"
            onClick={() => {
              navigate("/inventory");
            }}
          >
            <FontAwesomeIcon icon={faBoxesStacked} />
          </button>
          {children}
          
          <button className="aspect-square w-[50px]">
            <FontAwesomeIcon icon={faStore} />
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
