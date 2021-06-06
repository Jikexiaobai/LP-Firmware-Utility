import React, { useEffect } from "react";
import { useLocation } from "react-router";
import HeaderItem from "./HeaderItem";
import clsx from "clsx";
import { useStore } from "../hooks";
import { useObserver } from "mobx-react-lite";
import { headers } from "../routes";

const Header = ({ disabled }: any) => {
  const { pathname } = useLocation();
  const lpStore = useStore(({ launchpads }) => launchpads);

  useEffect(() => {
    document.title = "在线更新LaunchPad固件 | " + headers[pathname.slice(1)] +"董岩松博客";
  }, [pathname]);

  return useObserver(() => (
    <nav className="w-full h-16 flex flex-row items-stretch justify-between relative">
      <div class="flex-1 flex flex-row items-center px-4">
    <p class="font-bold text-2xl">在线更新LaunchPad固件</p>
    <p class="font-bold text-2xl">&nbsp;&nbsp;<a href="https://dongyansong.com/">董岩松博客赞助</a></p>
    </div>
      <div
        className="flex flex-row justify-center text-xl text-center"
      >
        {Object.entries(headers).map(([path, name]) => (
          <HeaderItem {...{ path, name, disabled }} key={name} />
        ))}
      </div>
      <div className="flex-1 flex flex-row items-center justify-end px-4">
        <span className="flex flex-row items-center text-xl">
          {lpStore.available ? lpStore.launchpad?.type || "No Launchpad Detected" : "WebMIDI Unsupported (Use Chrome)"}
          <div
            className={clsx(
              "w-4 h-4 ml-4 rounded-full border border-black",
              lpStore.launchpad ? "bg-green-700" : "bg-red-700"
            )}
          />
        </span>
      </div>
    </nav>
  ));
};

export default Header;
