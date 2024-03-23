import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React from "react";

// copy paste ref: https://uiverse.io/Javierrocadev/swift-snake-43
export default function ThemeToggler() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={resolvedTheme === "dark"}
        className="sr-only peer"
        onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      />
      <div
        className={cn(
          "group peer ring-0 bg-white  rounded-full outline-none duration-300 after:duration-300 w-12 h-6  shadow-md peer-checked:bg-slate-900  peer-focus:outline-none  after:content-['☀️'] after:rounded-full after:absolute after:outline-none after:h-5 after:w-5 after:top-[2px] after:left-[5px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-5 peer-checked:after:content-['🌙']"
        )}
      />
    </label>
  );
}
