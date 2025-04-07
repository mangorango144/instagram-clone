import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="flex md:flex-row flex-col min-h-screen">
      <Navbar />
      {/* Margin for the main content to prevent overlap with the navbar */}
      <main className="flex-1 mb-[70px] md:ml-[70px] 2xl:ml-[270px] xl:ml-[220px]">
        <Outlet />
      </main>
    </div>
  );
};
