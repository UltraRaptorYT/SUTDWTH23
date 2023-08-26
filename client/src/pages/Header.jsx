import React from "react";

function Header({ className }) {
  return (
    <header className={`fixed ${className} w-full`}>
      <div className="text-3xl">This is the Header page.</div>
    </header>
  );
}

export default Header;
