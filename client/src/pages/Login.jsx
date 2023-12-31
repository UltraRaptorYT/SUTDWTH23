import React from "react";

import { useNavigate } from "react-router-dom";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const Login = () => {
  // useState Logic
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  // Clearing and submitting input fields
  const clearAndRedirect = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    navigate("/profile");

    // Setting the input fields to empty
    setName("");
    setEmail("");
  };

  // Submit Action
  const handleSubmit = async (e) => {
    e.preventDefault();

    var { data, error } = await supabase
      .from("user")
      .select()
      .eq("name", name)
      .eq("email", email);

    if (data.length < 1) {
      // Store as a JSON Object
      const formData = {
        name: name,
        email: email,
      };

      var { data, error } = await supabase
        .from("user")
        .insert([formData])
        .select();

      if (error) {
        console.log(error);
        alert("Error");
      }
    }

    await clearAndRedirect();

    // Storing values in local storage
    localStorage.setItem("userid", data[0].id);
    // localStorage.setItem("name", name);
    // localStorage.setItem("email", email);
    // localStorage.setItem("bucks", data[0].bucks);
  };

  const imgUrl = new URL("/images/mascot.png", import.meta.url).href;
  return (
    <>
      <div className="flex min-h-[100svh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm gap-2 flex flex-col">
          <div className="flex justify-center">
            <img className="w-1/2 rounded-full" src={imgUrl} alt="default" />
          </div>
          <h1 className="text-center text-4xl font-bold mt-2">SustainaBite</h1>
          <h2 className="text-center text-2xl font-bold">
            Login to your account
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-xs">
          <form className="space-y-8" onSubmit={handleSubmit} method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Address
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
