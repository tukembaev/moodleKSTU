import { CourseMaterials } from "entities/Course/model/types/course";
import { FC } from "react";
import { MaterialAttachment } from "./MaterialAttachment";

interface MaterialCardProps {
  material: CourseMaterials;
  isOwner: boolean;
  onDelete: (id: string) => void;
}

export const MaterialCard: FC<MaterialCardProps> = ({
  material,
  isOwner,
  onDelete,
}) => {
  return (
    <MaterialAttachment
      material={material}
      canDelete={isOwner}
      onDelete={onDelete}
      className="min-w-[240px] flex-1 max-w-md"
    />
  );
};
