import { Button } from "@/components/ui/button";
import { ScheduleBlockType } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import { CgViewDay } from "react-icons/cg";
import { FaClock } from "react-icons/fa";

export default function BtnsChangeFormShema({
  blockType,
  handleChangeSchema,
}: {
  blockType: ScheduleBlockType;
  handleChangeSchema: (blockType: ScheduleBlockType) => void;
}) {
  return (
    <div className="flex justify-center items-between gap-4">
      <Button
        type="button"
        variant={`${blockType === "day" ? "default" : "secondary"}`}
        onClick={() => handleChangeSchema("day")}
        className={cn("flex-1 flex gap-2", null, {
          "scale-105": blockType === "day",
        })}
      >
        <CgViewDay className="text-lg" /> Day
      </Button>
      <Button
        variant={`${blockType === "time" ? "default" : "secondary"}`}
        type="button"
        onClick={() => handleChangeSchema("time")}
        className={cn("flex-1 flex gap-2", null, {
          "scale-105": blockType === "time",
        })}
      >
        <FaClock className="text-lg" /> w/ time
      </Button>
    </div>
  );
}
