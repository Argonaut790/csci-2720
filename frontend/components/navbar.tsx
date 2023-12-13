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

import { link as linkStyles } from "@nextui-org/theme";

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
} from "@/components/icons";
import { useUserSystem } from "@contexts/UserSystemContext";
import { Logo } from "@/components/icons";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import { Cookie } from "next/font/google";

export const Navbar = () => {
  const { user, loggedIn, logout, getLoginUser } = useUserSystem();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <NextUINavbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">CSCI 2720</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="center">
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit">CSCI 2720</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex">
          {user.name && <p className="font-bold text-inherit">Welcome! {user.name}</p>}
        </NavbarItem>
        <NavbarItem className="sm:hidden">
          {user.name && <p className="font-bold text-inherit">Hey! {user.name}</p>}
        </NavbarItem>

        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu className="gap-10">
        <NavbarMenuItem>
          <Link
            isExternal
            className="w-full flex justify-center items-center gap-2"
            color="foreground"
            href={siteConfig.links.github}
            size="lg"
          >
            <GithubIcon className="text-default-500 m-1" />
            <p>GitHub Documentation</p>
          </Link>
        </NavbarMenuItem>
        {loggedIn && (
          <NavbarMenuItem>
            <Button
              className="w-full flex justify-center items-center"
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
      </NavbarMenu>
    </NextUINavbar>
  );
};
