"use client";
import ScheduleSuggestion from "../schedule/ScheduleSuggestion";
import ScheduleContext from "./ScheduleContext";
import ScheduleHeader from "./ScheduleHeader";

export default function ArticlesPage() {
  return (
    <div className="flex flex-col">
      <ScheduleHeader />
      <div className="container mx-auto p-4 flex-grow">
        <ScheduleContext />
      </div>
      <ScheduleSuggestion type={"news"} />
    </div>
  );
}
