import React, { useState, useEffect, useRef, useCallback } from "react";

import axios from "axios";

function Recipe() {
  useEffect(() => {
    axios
      .post("https://docker-test-shec.onrender.com/RecipeSteps")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="w-full mx-auto flex flex-col max-w-[400px]">
      This is the Recipe page
    </div>
  );
}

export default Recipe;
