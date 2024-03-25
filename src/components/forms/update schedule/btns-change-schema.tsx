import { Button } from "@/components/ui/button";
import { ScheduleBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";

export default function BtnsChangeFormShema({
  blockType,
  handleChangeSchema,
}: {
  blockType: ScheduleBlock;
  handleChangeSchema: (blockType: ScheduleBlock) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-4">
      <Button
        type="button"
        variant={`${blockType === "day" ? "default" : "secondary"}`}
        onClick={() => handleChangeSchema("day")}
        className={cn({
          "scale-110": blockType === "day",
        })}
      >
        Day
      </Button>
      <Button
        variant={`${blockType === "time" ? "default" : "secondary"}`}
        type="button"
        onClick={() => handleChangeSchema("time")}
        className={cn({
          "scale-110": blockType === "time",
        })}
      >
        w/ time
      </Button>
    </div>
  );
}
