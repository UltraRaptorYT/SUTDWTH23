import React, { useState, useEffect, useRef, useCallback } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function TableRows({ data, key }) {
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
    <tr key={"tbr" + key}>
      {data.map((e, idx) => {
        let output = e;
        if (!isNaN(Date.parse(e)) && String(e).includes("T")) {
          console.log(e);
          let create_at = new Date(e);
          output = `${create_at.getDate()}-${
            month[create_at.getMonth()]
          }-${create_at.getFullYear()}`;
        }
        return (
          <td
            key={"td" + idx}
            className={classNames(
              key !== data.length - 1 ? "border-b border-gray-200" : "",
              "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
            )}
          >
            {idx == 0 ? imgName(output) : idx == 1 ? quantity(output) : output}
          </td>
        );
      })}
    </tr>
  );
}

function imgName(name) {
  return name;
}

function quantity(number) {
  return <div>{number}</div>;
}

export default TableRows;
