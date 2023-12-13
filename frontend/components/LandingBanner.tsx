import React from "react";
import { Link } from "@nextui-org/react";
import { SiteConfig, siteConfig } from "@/config/site";

export function LandingBanner() {
  return (
    <>
      <div className="w-full flex justify-center">
        <Link
          isExternal
          href={siteConfig.links.github}
          className="relative max-w-fit inline-flex items-center justify-between box-border whitespace-nowrap border-medium text-foreground bg-transparent px-1 h-7 text-small rounded-full w-full hover:bg-default-100 border-default-200/80 dark:border-default-100/80 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 ml-1 rounded-full bg-secondary"></span>
          <span className="flex-1 text-inherit font-normal px-2">
            Introducing v1.0.0&nbsp;
            <span aria-label="rocket emoji" role="img">
              🚀
            </span>
          </span>
        </Link>
      </div>
      <div className="text-center leading-8 md:leading-10 md:text-left">
        <div className="inline-block h-12">
          <div className="flex">
            <h1 className="tracking-tight font-semibold text-[2.1rem] lg:text-5xl">Find &nbsp;</h1>
            <h1 className="animate-bounce tracking-tight font-semibold from-[#FF1CF7] to-[#b249f8] text-[2.1rem] lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b">
              Best &nbsp;
            </h1>
          </div>
        </div>
        <h1 className="inline tracking-tight font-semibold text-[2.1rem] lg:text-5xl">
          Electric Vehicle Charging Station
        </h1>
      </div>
    </>
  );
}

export default LandingBanner;
