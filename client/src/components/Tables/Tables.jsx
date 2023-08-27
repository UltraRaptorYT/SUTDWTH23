import React, { useState, useEffect, useRef, useCallback } from "react";
import TableRows from "./TableRows";
import TableHeader from "./TableHeader";
import { useNavigate } from "react-router-dom";

function Tables({ data }) {
  const navigate = useNavigate();

  const tableHeader = ["Name", "Quantity", "Expires In Days", "Bought At"];

  if (data && data.length >= 1) {
    return (
      <div className=" mx-auto max-h-[calc(100svh-75px-75px-36px-36px-8px)] overflow-auto">
        <table className="border-separate border-spacing-0 min-w-full">
          <TableHeader data={tableHeader} />
          <tbody>
            {data.map((row, idx) => {
              return (
                <TableRows
                  data={Object.values(row).splice(1)}
                  keyProp={idx}
                  key={"TR" + idx}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="w-full text-2xl font-bold flex flex-col items-center justify-center gap-3 mt-5">
        <p>No Inventory!</p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="bg-pink-500 rounded-lg px-4 py-2 text-lg"
        >
          Add Inventory?
        </button>
      </div>
    );
  }
}

export default Tables;
