import React from "react";
import { Outlet } from "react-router-dom";
import SideList from "./dashboard/SideList";

const DashboardLayout = () => {
  return (
    <div>
      <SideList>
        <Outlet />
      </SideList>
    </div>
  );
};

export default DashboardLayout;
