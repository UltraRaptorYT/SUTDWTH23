import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CamButton from "../components/CamButton.jsx";

const Layout = () => {
  const headerHeight = 70;
  return (
    <main className="flex flex-col h-[100svh]">
      <Header className={`h-[${headerHeight}px]`} />
      <div className={`p-2`} style={{ marginTop: headerHeight + "px" }}>
        <Outlet />
      </div>
      <Footer>
        <CamButton />
      </Footer>
    </main>
  );
};

export default Layout;
