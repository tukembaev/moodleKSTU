import axios from "axios";
import i18n from "shared/config/i18n/i18n";

function firstString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length > 0) return firstString(value[0]);
  return null;
}

function detailFromData(data: unknown): string | null {
  if (typeof data === "string" && data.trim()) return data.trim();
  if (!data || typeof data !== "object" || data instanceof Blob) return null;

  const record = data as Record<string, unknown>;
  const fromDetail = firstString(record.detail);
  if (fromDetail) return fromDetail;
  const fromMessage = firstString(record.message) ?? firstString(record.error);
  if (fromMessage) return fromMessage;
  const firstKey = Object.keys(record)[0];
  return firstKey ? firstString(record[firstKey]) : null;
}

export function apiErrorDetail(
  error: unknown,
  fallback = i18n.t("Что-то пошло не так")
): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  return detailFromData(error.response?.data) || error.message || fallback;
}

export async function apiErrorDetailAsync(
  error: unknown,
  fallback = i18n.t("Что-то пошло не так")
): Promise<string> {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      if (!text.trim()) return apiErrorDetail(error, fallback);
      try {
        return detailFromData(JSON.parse(text)) || apiErrorDetail(error, fallback);
      } catch {
        return text.trim();
      }
    } catch {
      return apiErrorDetail(error, fallback);
    }
  }

  return apiErrorDetail(error, fallback);
}
