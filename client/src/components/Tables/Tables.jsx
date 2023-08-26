import React, { useState, useEffect, useRef, useCallback } from "react";
import TableRows from "./TableRows";

function Tables({ data }) {
  if (data) {
    return (
      <div
        style={{ display: "flex" }}
        className={`w-full grid grid-cols-${data[0].length}`}
      >
        <TableRows />
      </div>
    );
  } else {
    return <div>No Inventory! Start Scanning Today!</div>
  }
}

export default Tables;
