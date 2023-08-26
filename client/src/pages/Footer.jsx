import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer className="mt-auto">
      <div className="w-full aspect-[4/1] bg-black">
        <div className="">
          <FontAwesomeIcon icon={faCoffee} className="text-white"/>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
