import {
  Button,
  Kbd,
  Link,
  Input,
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/react";

import { Link as ReactScrollLink } from "react-scroll";
import { useUserSystem } from "@contexts/UserSystemContext";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { useState } from "react";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  NextUILogo,
  Logo,
  LogoDark,
} from "@/components/icons";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import { Cookie } from "next/font/google";

import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user, loggedIn, isadmin, logout, getLoginUser } = useUserSystem();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("navbar", user);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    // container mx-auto max-w-7xl px-6 flex-grow
    <NextUINavbar
      className="w-full h-max sticky top-0 z-50"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
    >
      <NavbarContent className="hidden sm:flex gap-6" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        <NavbarBrand>
          {theme === "dark" ? <Logo /> : <LogoDark />}
          <p className="font-bold text-inherit">EC2Find@HK</p>
        </NavbarBrand>
        {loggedIn && (
          <NavbarItem
            className={`hidden md:flex cursor-pointer font-bold ${
              theme == "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <ReactScrollLink
              to="AllDataPointsSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              All Data Points
            </ReactScrollLink>
          </NavbarItem>
        )}
        {loggedIn && (
          <NavbarItem
            className={`hidden md:flex cursor-pointer font-bold ${
              theme == "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <ReactScrollLink
              to="districtmapsection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              District Map
            </ReactScrollLink>
          </NavbarItem>
        )}
        {loggedIn && (
          <NavbarItem
            className={`hidden md:flex cursor-pointer font-bold ${
              theme == "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <ReactScrollLink
              to="NearestChargerSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Nearest Charger
            </ReactScrollLink>
          </NavbarItem>
        )}
        {loggedIn && (
          <NavbarItem
            className={`hidden lg:flex cursor-pointer font-bold ${
              theme == "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <ReactScrollLink
              to="DataCRUDSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              Data CRUD
            </ReactScrollLink>
          </NavbarItem>
        )}
        {isadmin && (
          <NavbarItem
            className={`hidden lg:flex cursor-pointer font-bold ${
              theme == "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
          >
            <ReactScrollLink
              to="UserCRUDSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              User CRUD
            </ReactScrollLink>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          {theme === "dark" ? <Logo /> : <LogoDark />}
          <p className="font-bold text-inherit">EC2Find @HK</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {user.username && <p className="font-bold text-inherit">Welcome! {user.username}</p>}
        </NavbarItem>
        <NavbarItem className="lg:hidden">
          {user.username && <p className="font-bold text-inherit">Hey! {user.username}</p>}
        </NavbarItem>

        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu className="gap-10">
        {loggedIn && (
          <NavbarMenuItem
            className={`cursor-pointer font-bold hover:text-slate-400 duration-200 w-full flex justify-center items-center gap-2`}
          >
            <ReactScrollLink
              to="AllDataPointsSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              All Data Points
            </ReactScrollLink>
          </NavbarMenuItem>
        )}
        {loggedIn && (
          <NavbarMenuItem
            className={`cursor-pointer font-bold hover:text-slate-400 duration-200 w-full flex justify-center items-center gap-2`}
          >
            <ReactScrollLink
              to="districtmapsection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              District Map
            </ReactScrollLink>
          </NavbarMenuItem>
        )}
        {loggedIn && (
          <NavbarMenuItem
            className={`cursor-pointer font-bold hover:text-slate-400 duration-200 w-full flex justify-center items-center gap-2`}
          >
            <ReactScrollLink
              to="NearestChargerSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              Nearest Charger
            </ReactScrollLink>
          </NavbarMenuItem>
        )}
        {loggedIn && (
          <NavbarMenuItem
            className={`cursor-pointer font-bold hover:text-slate-400 duration-200 w-full flex justify-center items-center gap-2`}
          >
            <ReactScrollLink
              to="DataCRUDSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              Data CRUD
            </ReactScrollLink>
          </NavbarMenuItem>
        )}
        {isadmin && (
          <NavbarMenuItem
            className={`cursor-pointer font-bold hover:text-slate-400 duration-200 w-full flex justify-center items-center gap-2`}
          >
            <ReactScrollLink
              to="UserCRUDSection"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              User CRUD
            </ReactScrollLink>
          </NavbarMenuItem>
        )}
        {loggedIn && (
          <NavbarMenuItem>
            <Button
              className="w-full flex justify-center items-center "
              color="danger"
              size="lg"
              onClick={() => {
                logout();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              Sign Out
            </Button>
          </NavbarMenuItem>
        )}
        <NavbarMenuItem>
          <Link
            isExternal
            className="w-full flex justify-center items-center gap-2"
            color="foreground"
            href={siteConfig.links.github}
            size="lg"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <GithubIcon className="text-default-500 m-1" />
            <p>GitHub Documentation</p>
          </Link>
        </NavbarMenuItem>
        <p className="text-sm text-default-400 flex justify-center"> Powered By NextUI </p>
      </NavbarMenu>
    </NextUINavbar>
  );
};
