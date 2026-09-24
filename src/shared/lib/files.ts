import i18n from "shared/config/i18n/i18n";

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error(i18n.t("Не удалось прочитать файл")));
    reader.readAsDataURL(file);
  });
}

export async function dataUrlToFile(
  dataUrl: string,
  filename = "image"
): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const ext = blob.type.split("/")[1]?.split("+")[0] || "png";
  const name = filename.includes(".") ? filename : `${filename}.${ext}`;
  return new File([blob], name, { type: blob.type || "image/png" });
}
