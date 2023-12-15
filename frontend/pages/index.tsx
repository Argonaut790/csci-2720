import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import LoginModel from "@/components/LoginModel";
import { Spinner } from "@nextui-org/react";
import UserSystem from "@/components/UserSystem";
import { useUserSystem } from "@/contexts/UserSystemContext";
import DynamicContent from "@/components/DynamicContent";
import DataCRUD from "@/components/DataCRUD";
import UserCRUD from "@/components/UserCRUD";
import TableInTest from "@/components/tableInTest/table";
import TableOri from "@/components/ortable/table";
import LandingBanner from "@/components/LandingBanner";

// External UI libraries to upgrade user experience
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MapView from "@/components/tableInTest/mapView";
export default function IndexPage() {
  const { loading, loggedIn, isadmin } = useUserSystem();

  return (
    <DefaultLayout>
      <section className="h-full py-4 md:py-6 w-full">
        {loggedIn ? (
          <>
            <DynamicContent />
            <DataCRUD />
            <TableInTest />
            {isadmin && <UserCRUD />}
          </>
        ) : (
          <div className="flex relative z-20 flex-col gap-14 w-full justify-center">
            <LandingBanner />
            <UserSystem />
            {loading && <Spinner label="Loading..." color="secondary" />}
          </div>
        )}
      </section>
      <ToastContainer />
    </DefaultLayout>
  );
}
