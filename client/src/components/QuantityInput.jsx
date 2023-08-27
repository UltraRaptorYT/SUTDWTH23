import React, { useState } from "react";
import "../QuantityInput.css";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const userid = localStorage.getItem("userid");

var { data, error } = await supabase
  .from("user_food")
  .select("*, food(*)")
  .eq("userId", userid)
  .order("expires_in");
if (error) {
  console.log(error);
  // alert("Error");
}

if (data) {
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
}
function QuantityInput({ quantity, keyProp }) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity ?? 0);
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(1100);

  const subFrom = async () => {
    if (currentQuantity > minVal) {
      setCurrentQuantity(currentQuantity - 1);
      var { data, error } = await supabase
        .from("user_food")
        .update({ quantity: currentQuantity - 1 })
        .eq("userId", userid)
        .eq("foodId", formattedData[keyProp]["id"])
        .eq("created_at", formattedData[keyProp]["created_at"])
        .select("*");
      if (error) {
        console.log(error);
        return;
      }
      console.log(data);
    }
  };

  const addTo = async () => {
    if (currentQuantity < maxVal) {
      setCurrentQuantity(currentQuantity + 1);
      var { data, error } = await supabase
        .from("user_food")
        .update({ quantity: currentQuantity + 1 })
        .eq("userId", userid)
        .eq("foodId", formattedData[keyProp]["id"])
        .eq("created_at", formattedData[keyProp]["created_at"])
        .select("*");
      if (error) {
        console.log(error);
        return;
      }
      console.log(data);
    }
  };

  const changeQuantity = async (event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= minVal && newQuantity <= maxVal) {
      setCurrentQuantity(newQuantity);
      var { data, error } = await supabase
        .from("user_food")
        .update({ quantity: newQuantity })
        .eq("userId", userid)
        .eq("foodId", formattedData[keyProp]["id"])
        .eq("created_at", formattedData[keyProp]["created_at"])
        .select("*");
      if (error) {
        console.log(error);
        return;
      }
      console.log(data);
    }
  };

  return (
    <div
      className="quantity order-3 py-3 col-7 px-0 col-lg-5 order-lg-3 ml-auto"
      key={"QtyInput" + keyProp}
    >
      <span className="input-number-decrement" onClick={subFrom}>
        –
      </span>
      <input
        className="input-number"
        type="text"
        value={currentQuantity}
        onChange={changeQuantity}
        min={minVal}
        max={maxVal}
      />
      <span className="input-number-increment" onClick={addTo}>
        +
      </span>
    </div>
  );
}

export default QuantityInput;
