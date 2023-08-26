import React, { useState, useEffect, useRef, useCallback } from "react";
import Tables from "../components/Tables/Tables";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const userid = localStorage.getItem("userid");

function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    async function getInventory() {
      var { data, error } = await supabase
        .from("user_food")
        .select("*, food(*)")
        .eq("userId", userid)
        .order("expires_in");
      if (error) {
        console.log(error);
        // alert("Error");
      }

      const formattedData = data.map((item) => {
        return {
          id: item.food.id,
          name: item.food.name,
          quantity: item.quantity,
          expires_in: item.expires_in,
          created_at: item.created_at,
        };
      });

      console.log(formattedData);

      setInventory(formattedData);
    }

    getInventory();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center  mb-2">
        <div className="font-bold text-lg">What you currently have: </div>
        <button className="my-auto flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          + Add New
        </button>
      </div>
      <Tables data={inventory} />
    </>
  );
}

export default Inventory;
