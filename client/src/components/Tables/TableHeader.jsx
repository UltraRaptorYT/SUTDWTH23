import React, { useState, useEffect, useRef, useCallback } from "react";

function TableHeader({ data }) {
  return (
    <thead className="w-full">
      <tr className="w-full">
        {data.map((key, index) => {
          return (
            <th
              key={"thr" + index}
              scope="col"
              className={
                index == 0
                  ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 whitespace-nowrap"
                  : index == data.length - 1
                  ? "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell whitespace-nowrap"
                  : "sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter whitespace-nowrap"
              }
            >
              {key}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default TableHeader;
