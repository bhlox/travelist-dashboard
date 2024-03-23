import React from "react";

export default function ToastContent({
  description,
  title,
}: {
  title: string;
  description: string | undefined;
}) {
  return (
    <>
      <h4 className="text-lg md:text-xl font-bold">{title}</h4>
      <p>{description}</p>
    </>
  );
}
