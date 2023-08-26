import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function CamButton({ onClick }) {
  const navigate = useNavigate();
  if (!onClick) {
    onClick = () => {
      navigate("/");
    };
  }
  return (
    <div className="self-start relative w-[65px] -translate-y-1/2">
      <button
        onClick={onClick}
        className="w-full aspect-square flex bg-blue-500 rounded-full p-2 border-4 border-black items-center justify-center"
      >
        <FontAwesomeIcon icon={faCamera} />
      </button>
    </div>
  );
}

export default CamButton;
