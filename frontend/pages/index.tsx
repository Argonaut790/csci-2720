import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import LoginModel from "@/components/LoginModel";
import UserSystem from "@/components/UserSystem";
import { useUserSystem } from "@/contexts/UserSystemContext";
import DynamicContent from "@/components/DynamicContent";
import DataCRUD from "@/components/DataCRUD";
import UserCRUD from "@/components/UserCRUD";
import TableInTest from "@/components/tableInTest/table"

import MapView from "@/components/tableInTest/mapView";
export default function IndexPage() {
  const { loggedIn, isadmin } = useUserSystem();

  return (
    <DefaultLayout>
      <section className="h-full py-8 md:py-10 w-full">
        {loggedIn ? (
          <>
            <DynamicContent />
            <DataCRUD />
            <TableInTest />

            {/* <TableOri /> */}
            {/* {isadmin ? <UserCRUD /> : null} */}
            {isadmin ? <UserCRUD /> : <UserCRUD />}

          </>
        ) : (
          <UserSystem />
        )}

        {/* <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Make&nbsp;</h1>
          <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
          <br />
          <h1 className={title()}>
            websites regardless of your design experience.
          </h1>
          <h4 className={subtitle({ class: "mt-4" })}>
            Beautiful, fast and modern React UI library.
          </h4>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            href={siteConfig.links.docs}
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div> */}
      </section>
    </DefaultLayout>
  );
}
