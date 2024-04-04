import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/bookings");
  return <main className="">home</main>;
}
