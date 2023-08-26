import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <main className="flex flex-col h-[100svh]">
      <Header className="h-[100px]"/>
      <div className="mt-[100px]">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
