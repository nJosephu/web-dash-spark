
import React from "react";
import { Outlet } from "react-router-dom";
import BeneficiarySidebar from "./BeneficiarySidebar";
import TopNav from "./TopNav";
import { useAuth } from "@/context/AuthContext";

const BeneficiaryLayout = () => {
  const { user } = useAuth();
  const userName = user?.name || "User";

  return (
    <div className="flex min-h-screen">
      <BeneficiarySidebar />

      <div className="flex-1 w-full md:ml-0 lg:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryLayout;
