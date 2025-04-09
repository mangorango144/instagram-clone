import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const Layout = () => {
  const { uid } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!uid;

  return (
    <div className="flex md:flex-row flex-col min-h-screen">
      {isAuthenticated && <Navbar />}
      {/* Margin for the main content to prevent overlap with the navbar */}
      <main
        className={
          isAuthenticated
            ? "flex-1 mb-[70px] md:ml-[70px] 2xl:ml-[270px] xl:ml-[220px]"
            : "flex-1"
        }
      >
        <Outlet />
      </main>
    </div>
  );
};
