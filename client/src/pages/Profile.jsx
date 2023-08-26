import React, { useEffect, useState } from "react";
import DefaultImage from "../images/default.jpg";

import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [bucks, setBucks] = useState();

  useEffect(() => {
    async function getUser() {
      var { data, error } = await supabase
        .from("user")
        .select()
        .eq("id", localStorage.getItem("userid"));

      if (error) {
        console.log(error);
        alert("Error");
      }

      setName(data[0].name);
      setEmail(data[0].email);
      setBucks(data[0].bucks);
    }
    getUser();
  }, []);

  function handlerLogOut() {
    let yes = confirm("Are you sure you want to log out?");
    if (yes) {
      localStorage.clear();
      navigate("/login");
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col gap-2 items-center h-full pt-5">
      <img
        className="rounded-full object-contain aspect-square w-1/3 mx-auto"
        src={DefaultImage}
        alt="default"
      />
      <div
        id="information"
        className="flex flex-col items-center justify-center mt-5 gap-2"
      >
        <p>
          Name: <span className="font-bold">{name}</span>
        </p>
        <p>
          Email: <span className="font-bold">{email}</span>
        </p>
        <p className="text-lg">
          SustainaBucks:{" "}
          <span
            className="font-bold"
            style={{ color: `hsl(${bucks}, 100%, 50%)` }}
          >
            {bucks}
          </span>
        </p>
      </div>
      <button
        onClick={handlerLogOut}
        className="my-auto flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Log out
      </button>
    </div>
  );
}

export default Profile;
