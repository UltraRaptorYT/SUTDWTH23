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
      <Tables data={inventory} />
    </>
  );
}

export default Inventory;
