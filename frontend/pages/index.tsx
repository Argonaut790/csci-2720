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
import { useEffect } from "react";

export default function IndexPage() {
  const { loading, loggedIn, isadmin } = useUserSystem();

  useEffect(() => {
    console.log("FRONTEND RUNNING");
    console.log(loading);
    console.log(loggedIn);
    console.log(isadmin);
    console.log("================");
  }, []);

  return (
    <DefaultLayout>
      <section className="h-full py-8 md:py-10 w-full">
        {loading && <Spinner label="Loading..." color="secondary" />}
        {loggedIn ? (
          <>
            <DynamicContent />
            <DataCRUD />
            <TableInTest />

            {/* <TableOri /> */}
            {/* {isadmin ? <UserCRUD /> : null} */}
            {isadmin && <UserCRUD />}
          </>
        ) : (
          <div className="flex relative z-20 flex-col gap-14 w-full justify-center">
            <LandingBanner />
            <UserSystem />
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
