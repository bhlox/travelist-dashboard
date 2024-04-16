import { updatePendingBooksToOverdue } from "@/lib/actions/bookings";

export async function GET(request: Request) {
  console.log("updating statuses from pending to overdue");
  const updatedCount = await updatePendingBooksToOverdue();
  if (updatedCount) {
    return new Response(JSON.stringify({ message: "Statuses updated" }), {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({ message: "No booking statuses to update" }),
      { status: 200 }
    );
  }
}
