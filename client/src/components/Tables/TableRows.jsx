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
              "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
            )}
          >
            {idx == 0 ? (
              imgName(output)
            ) : idx == 1 ? (
              <QuantityInput quantity={output} keyProp={keyProp} />
            ) : (
              output
            )}
          </td>
        );
      })}
    </tr>
  );
}

function imgName(name) {
  return name;
}

export default TableRows;
