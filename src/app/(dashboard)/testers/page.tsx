"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function TestPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("c");
  //   const [test, setTest] = React.useState(0);
  const router = useRouter();

  //   React.useEffect(() => {
  //     router.push(`/testers?c=${test}`);
  //   }, [test, router]);
  return (
    <div>
      <h4 className="text-4xl text-center font-bold">{`test-id-${query}`}</h4>
      <button onClick={() => router.push(`/testers?c=24`)}>click me</button>
    </div>
  );
}
