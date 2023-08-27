import React, { useState, useEffect, useRef, useCallback } from "react";

import Coupon from "../components/Coupon";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function Store() {
  const [bucks, setBucks] = useState();
  const [coupons, setCoupons] = useState([]);

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

      setBucks(data[0].bucks);
    }

    async function getCoupons() {
      var { data, error } = await supabase
        .from("coupon")
        .select("*, user_coupon(*)")
        .eq("user_coupon.userid", localStorage.getItem("userid"));

      if (error) {
        console.log(error);
        alert("Error");
      }

      data = data.filter((e) => {
        return e.user_coupon.length == 0;
      });

      console.log(data);
      setCoupons(data);
    }
    getUser();
    getCoupons();
  }, []);
  return (
    <div className="w-full mx-auto flex flex-col max-w-[400px] gap-3">
      <div className="flex w-full">
        <p className="text-lg ml-auto">
          SustainaBucks: <span className="font-bold">{bucks}</span>
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full mx-auto">
        {coupons.length > 1
          ? coupons.map((e, idx) => {
              return <Coupon key={idx} data={e} bucks={bucks} />;
            })
          : <div className="text-center text-3xl h-[100px] flex items-center justify-center">No Coupons Found</div>}
      </div>
    </div>
  );
}

export default Store;
