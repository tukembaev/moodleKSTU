import { queryOptions } from "@tanstack/react-query";
import $api_edu from "shared/api/api_edu";
import { mapTodayResponse } from "./today";
import { TodayData } from "./types";

export async function getToday(): Promise<TodayData> {
  const response = await $api_edu.get("today/");
  return mapTodayResponse(response.data);
}

export const todayQueries = {
  today: (isStudent: boolean) =>
    queryOptions({
      queryKey: ["today", isStudent],
      queryFn: getToday,
    }),
};
