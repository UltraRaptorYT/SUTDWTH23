import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  // New navigator object
  const navigate = useNavigate();

  // Navigate to login page
  const handleLogin = () => {
    navigate("/Login");
  };

  return (
    <footer className="mt-auto">
      <div className="w-screen h-[70px] pt-[20px]">
        <div className="bg-red-500 h-full border-t-4 border-black text-xl relative flex items-center justify-center">
          <div className="flex items-center justify-around gap-12 h-full">
            <button onClick={handleLogin}>
              <FontAwesomeIcon icon={faUtensils} />
              <div>Login</div>
            </button>
            <button>
              <FontAwesomeIcon icon={faUtensils} />
            </button>
            <div className="self-start relative w-30">
              <button className="-translate-y-1/2">
                <FontAwesomeIcon
                  type="button"
                  icon={faUtensils}
                  className="bg-blue-500 rounded-full aspect-square p-2 border-4 border-black"
                />
              </button>
            </div>
            <button>
              <FontAwesomeIcon icon={faUtensils} />
            </button>
            <button>
              <FontAwesomeIcon icon={faUtensils} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
