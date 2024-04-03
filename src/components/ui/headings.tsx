import React from "react";
import { Separator } from "./separator";

export default function Headings({
  description,
  title,
}: {
  title: string;
  description: string | undefined;
}) {
  return (
    <>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500/80 dark:text-gray-200">
            {description}
          </p>
        )}
      </div>
      <Separator className="my-2" />
    </>
  );
}
