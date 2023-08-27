import React, { useState, useEffect, useRef, useCallback } from "react";
import QuantityInput from "../QuantityInput";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TableRows({ data, keyProp }) {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <tr>
      {data.map((e, idx) => {
        let output = e;
        if (!isNaN(Date.parse(e)) && String(e).includes("T")) {
          let create_at = new Date(e);
          output = `${create_at.getDate()}-${
            month[create_at.getMonth()]
          }-${create_at.getFullYear()}`;
        }
        return (
          <td
            key={"td" + keyProp + "-" + idx}
            className={classNames(
              keyProp !== data.length - 1 ? "border-b border-gray-200" : "",
              "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 text-center"
            )}
          >
            {idx == 0 ? (
              imgName(output, keyProp)
            ) : idx == 1 ? (
              <QuantityInput quantity={output} keyProp={keyProp} />
            ) : idx == 2 ? (
              colorDays(output)
            ) : (
              output
            )}
          </td>
        );
      })}
    </tr>
  );
}

function imgName(name, keyProp) {
  return (
    <div className="flex gap-2 items-center justify-center">
      <input type="checkbox" id={`idk${keyProp}`} name="ingredients"/>
      <label for={`idk${keyProp}`}>{name}</label>
    </div>
  );
}

function colorDays(days) {
  let color;
  if (days < 5) {
    color = "rgb(239 68 68)";
  } else if (days < 10) {
    color = "rgb(234 179 8)";
  } else {
    color = "rgb(34 197 94)";
  }
  return (
    <span
      style={{
        background: color,
        width: "50%",
        display: "block",
        margin: "auto",
      }}
    >
      {days}
    </span>
  );
}

export default TableRows;
