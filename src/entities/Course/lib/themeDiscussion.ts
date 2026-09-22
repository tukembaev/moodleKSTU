import { FeedItem } from "entities/Course/model/types/course";
import { unwrapList } from "./courseFeed";

export const DISCUSSION_POLL_MS = 5_000;

function createdAtMs(value: FeedItem["created_at"] | string | number | null | undefined): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function sortDiscussionNewestFirst(items: FeedItem[]): FeedItem[] {
  return [...items]
    .map((item) => ({
      ...item,
      replies: item.replies?.length
        ? sortDiscussionOldestFirst(item.replies)
        : item.replies,
    }))
    .sort((a, b) => createdAtMs(b.created_at) - createdAtMs(a.created_at));
}

function sortDiscussionOldestFirst(items: FeedItem[]): FeedItem[] {
  return [...items]
    .map((item) => ({
      ...item,
      replies: item.replies?.length
        ? sortDiscussionOldestFirst(item.replies)
        : item.replies,
    }))
    .sort((a, b) => createdAtMs(a.created_at) - createdAtMs(b.created_at));
}

export function normalizeThemeDiscussion(data: unknown): FeedItem[] {
  return sortDiscussionNewestFirst(unwrapList(data) as FeedItem[]);
}
