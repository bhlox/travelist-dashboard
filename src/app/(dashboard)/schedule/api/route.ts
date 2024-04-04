import { deleteSchedules, getSchedules } from "@/lib/actions/schedule";
import { isDateInPast } from "@/lib/utils";

export async function DELETE(request: Request) {
  const toBeDeletedSchedules: number[] = [];

  const blockedSchedules = await getSchedules({ all: true });
  const mappedData: { id: number; date: Date }[] = blockedSchedules.map(
    (day) => ({
      date: new Date(day.date),
      id: day.id,
    })
  );
  for (const day of mappedData) {
    if (isDateInPast(day.date)) {
      toBeDeletedSchedules.push(day.id);
    }
  }
  if (toBeDeletedSchedules.length) {
    await deleteSchedules(toBeDeletedSchedules);
    return new Response(
      JSON.stringify({ message: "Past schedules deleted successfully" }),
      { status: 204 }
    );
  } else {
    return new Response(
      JSON.stringify({ message: "No past schedules found" }),
      { status: 204 }
    );
  }
}
