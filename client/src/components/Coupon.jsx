import React, { useState, useEffect, useRef, useCallback } from "react";

import { createClient } from "@supabase/supabase-js";

import { useNavigate } from "react-router-dom";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const userid = localStorage.getItem("userid");

function Coupon({ data, bucks }) {
  const navigate = useNavigate();
  async function buyCoupon(couponInfo) {
    if (bucks < couponInfo.points) {
      alert("No enough points");
      return;
    }
    var { data, error } = await supabase
      .from("user")
      .update({ bucks: bucks - couponInfo.points })
      .eq("id", userid)
      .select();
    if (error) {
      console.log(error);
      return;
    }
    console.log(couponInfo.id);
    var { data, error } = await supabase
      .from("user_coupon")
      .insert({ userid: userid, couponid: couponInfo.id })
      .select();
    navigate(0);
  }

  return (
    <button className="w-full h-[75px] flex" onClick={() => buyCoupon(data)}>
      <div className="flex flex-col justify-center items-center min-w-[75px] max-w-[75px] h-full border-black border-2">
        <h2 className="text-red-500 font-bold text-2xl">${data.discount}</h2>
        <h2 className="text-red-500 font-bold text-xl">OFF</h2>
      </div>
      <div className="w-full flex p-2 relative h-full">
        <div>
          <span className="font-bold">${data.discount} OFF</span> at {data.name}
        </div>
        <div className="absolute bottom-[0.25rem] right-[0.75rem] flex gap-2 items-center">
          <div className="w-5 aspect-square rounded-full bg-yellow-500"></div>
          {data.points}
        </div>
      </div>
    </button>
  );
}

export default Coupon;
