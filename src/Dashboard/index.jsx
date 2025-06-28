import { Outlet } from "react-router-dom";
import { MiniDrawer } from "../Utils/designUtils";
import { Fragment } from "react";
import { useSelectedValue } from "../Hooks/customHooks";
import { selectedIsLoading } from "../Redux/Dashboard_Redux/selector";
import { CircularProgress } from "@mui/material";

const DashboardCompound = () => {
  const [isLoading] = useSelectedValue(selectedIsLoading);
  return (
    <Fragment>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CircularProgress size={60} />
        </div>
      )}
      <MiniDrawer>
        <div className="scroll-design overflow-scroll">
          <Outlet />
        </div>
      </MiniDrawer>
    </Fragment>
  );
};

export default DashboardCompound;
