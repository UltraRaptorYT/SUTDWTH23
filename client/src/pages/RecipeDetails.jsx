import { useParams } from "react-router-dom";
import React from "react";

function RecipeDetails() {
  const { recipeID } = useParams();
  return <div className="w-full max-w-[400px] mx-auto grow">hi</div>;
}

export default RecipeDetails;
