import { useParams } from "react-router-dom";
import React from "react";

function About() {
  const { aboutId } = useParams();
  return <div className="text-4xl">This is the about page.{aboutId}</div>;
}

export default About;
