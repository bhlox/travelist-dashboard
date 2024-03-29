"use client";
import { useTheme } from "next-themes";
import React from "react";

export default function ThemeToggler2() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="absolute bottom-4 left-8">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={resolvedTheme === "dark"}
          className="sr-only peer"
          onChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
        <div className="peer ring-0 bg-rose-400  rounded-full outline-none duration-300 after:duration-500 w-12 h-12  shadow-md peer-checked:bg-emerald-800  peer-focus:outline-none  after:content-['☀️'] after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center  peer-hover:after:scale-75 peer-checked:after:content-['🌙'] after:-rotate-180 peer-checked:after:rotate-0" />
      </label>
    </div>
  );
}
