import { PlusIcon } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FormQuery } from "shared/config/formConfig/formQuery";
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
  const { t } = useTranslation();
  const openForm = useForm();

  return (
    <Attachment
      state="idle"
      className="w-full min-w-0 cursor-pointer sm:min-w-[240px] sm:flex-1 sm:max-w-md"
    >
      <AttachmentMedia>
        <PlusIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{t("Добавить материал")}</AttachmentTitle>
        <AttachmentDescription>
          {t("Нажмите или перетащите файлы")}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentTrigger
        aria-label={t("Добавить учебный материал")}
        onClick={() => openForm(FormQuery.ADD_MATERIAL, { id: themeId })}
      />
    </Attachment>
  );
};
