import { PlusIcon } from "lucide-react";
import { FC } from "react";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "shared/shadcn/ui/attachment";

interface AddMaterialCardProps {
  themeId: string;
}

export const AddMaterialCard: FC<AddMaterialCardProps> = ({ themeId }) => {
  const openForm = useForm();

  return (
    <Attachment
      state="idle"
      className="min-w-[240px] flex-1 max-w-md cursor-pointer"
    >
      <AttachmentMedia>
        <PlusIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>Добавить материал</AttachmentTitle>
        <AttachmentDescription>
          Нажмите или перетащите файлы
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger
        aria-label="Добавить учебный материал"
        onClick={() => openForm(FormQuery.ADD_MATERIAL, { id: themeId })}
      />
    </Attachment>
  );
};
