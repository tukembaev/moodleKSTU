import { CourseMaterials } from "entities/Course/model/types/course";

export function isTextMaterial(material: CourseMaterials): boolean {
  if (material.kind === "text") return true;
  return Boolean(
    material.content?.trim() && !material.file && !material.files && !material.url
  );
}

export function visibleThemeMaterials(
  materials: CourseMaterials[] | undefined
): CourseMaterials[] {
  return (materials ?? []).filter(
    (material) =>
      material.file || material.files || material.url || isTextMaterial(material)
  );
}
