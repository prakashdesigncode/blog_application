import { Outlet } from "react-router-dom";
import { MiniDrawer } from "../Utils/designUtils";

const DashboardCompound = () => {
  return (
    <>
      <MiniDrawer>
        <div className="scroll-design overflow-scroll">
          <Outlet />
        </div>
      </MiniDrawer>
    </>
  );
};

export default DashboardCompound;
