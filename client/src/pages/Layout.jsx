import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import CamButton from "../components/CamButton.jsx";

const Layout = () => {
  const headerHeight = 75;
  return (
    <main className="flex flex-col h-[100svh]">
      <Header
        headerHeight={headerHeight}
      />
      <div className={`p-2 grow`} style={{ marginTop: headerHeight + "px" }}>
        <Outlet />
      </div>
      <Footer>
        <CamButton />
      </Footer>
    </main>
  );
};

export default Layout;
