import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";

import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { LuCloudUpload, LuFileText } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useFormParam } from "shared/hooks";
import { Card } from "shared/shadcn/ui/card";
import { FieldLabel, RichTextEditor } from "shared/components";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
import { isAllowedMaterialFile, MATERIAL_FILE_ACCEPT } from "shared/lib/fileKind";
import { UploadMaterialPayload } from "../model/types/course_payload";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import { isTextMaterial } from "entities/Course/lib/textMaterial";
import { richTextIsEmpty } from "shared/components/richText";
import { setMaterialDrawerWide } from "shared/lib/materialDrawerWidth";
import { cn } from "shared/lib/utils";

type MaterialTab = "file" | "text";

type TextMaterialPayload = {
  description: string;
};

const Add_Material_file = () => {
  const { t } = useTranslation();
  const themeId = useFormParam("id");
  const materialId = useFormParam("material");
  const editing = Boolean(materialId);
  const { data: themeMaterials, isPending: isLoadingMaterial } = useQuery({
    ...courseQueries.allTaskMaterials(themeId),
    enabled: Boolean(themeId && materialId),
  });
  const existing = useMemo(
    () =>
      themeMaterials?.find(
        (item) => item.id === materialId && isTextMaterial(item)
      ) ?? null,
    [themeMaterials, materialId]
  );
  const [tab, setTab] = useState<MaterialTab>(editing ? "text" : "file");
  const textLayout = editing || tab === "text";
  const [html, setHtml] = useState("");
  const [editorSeed, setEditorSeed] = useState<string | null>(editing ? null : "new");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UploadMaterialPayload>();
  const {
    register: registerText,
    handleSubmit: handleTextSubmit,
    formState: { errors: textErrors },
    setValue: setTextValue,
  } = useForm<TextMaterialPayload>({
    defaultValues: { description: "" },
  });
  const { mutate: add_material, isPending } = courseQueries.create_material();
  const { mutate: createText, isPending: isCreatingText } =
    courseQueries.create_text_material();
  const { mutate: updateText, isPending: isUpdatingText } =
    courseQueries.update_text_material();
  const isSavingText = isCreatingText || isUpdatingText;
  const navigate = useNavigate();

  useEffect(() => {
    setMaterialDrawerWide(editing || tab === "text");
    return () => setMaterialDrawerWide(false);
  }, [tab, editing]);

  useEffect(() => {
    if (!existing || editorSeed === existing.id) return;
    setTextValue("description", existing.description);
    setHtml(existing.content ?? "");
    setEditorSeed(existing.id);
  }, [existing, editorSeed, setTextValue]);

  useEffect(() => {
    setValue("course_detail", themeId || "");
  }, [themeId, setValue]);

  const onSubmitFile = async (data: UploadMaterialPayload) => {
    const file = watch("file");

    const formData = new FormData();
    if (file?.length) {
      if (!isAllowedMaterialFile(file[0])) {
        toast.error(t("Можно загрузить только PDF или изображения"));
        return;
      }
      formData.append("file", file[0]);
    } else {
      formData.append("url", data.url || "");
    }
    formData.append("description", watch("description"));
    formData.append("course_detail", data.course_detail);

    add_material(formData);
    navigate(-1);
  };

  const onSubmitText = (data: TextMaterialPayload) => {
    if (!themeId) {
      toast.error(t("Не удалось определить тему"));
      return;
    }
    const content = html || existing?.content || "";
    if (richTextIsEmpty(content)) {
      toast.warning(t("Вставьте текст материала"));
      return;
    }
    const payload = {
      description: data.description.trim(),
      content,
    };
    if (existing) {
      updateText(
        { id: existing.id, ...payload },
        { onSuccess: () => navigate(-1) }
      );
      return;
    }
    createText(
      { course_detail: themeId, ...payload },
      { onSuccess: () => navigate(-1) }
    );
  };

  return (
    <section className={cn("py-4", textLayout && "flex min-h-0 flex-1 flex-col overflow-hidden py-2")}>
      <Card className={cn("flex flex-col gap-4 p-6", textLayout && "min-h-0 flex-1")}>
        <Tabs
          value={editing ? "text" : tab}
          onValueChange={(value) => setTab(value as MaterialTab)}
          className={cn(textLayout && "min-h-0 flex-1")}
        >
          {!editing && (
            <TabsList className="w-full">
              <TabsTrigger value="file" className="flex-1">
                {t("Файл или ссылка")}
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1">
                {t("Текст")}
              </TabsTrigger>
            </TabsList>
          )}

          {!editing && (
          <TabsContent value="file">
            <form
              onSubmit={handleSubmit(onSubmitFile, onFormInvalid)}
              className="grid gap-4 pt-2"
            >
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="course" required>
                  {t("Описание материала")}
                </FieldLabel>
                <Input
                  type="text"
                  placeholder={t("Введите описание")}
                  {...register("description", requiredField(t("Заполните описание материала")))}
                />
                {errors.description && (
                  <span className="text-xs text-red-500">{t("Вопрос обязателен")}</span>
                )}
              </div>
              {!watch("file")?.length && (
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="course">{t("Ссылка на файл/видео/фото")}</FieldLabel>
                  <Input
                    type="text"
                    placeholder={t("Добавьте ссылку")}
                    {...register("url")}
                  />
                </div>
              )}
              {!watch("url")?.length && (
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="title">{t("Материал")}</FieldLabel>
                  <Input
                    type="file"
                    accept={MATERIAL_FILE_ACCEPT}
                    placeholder={t("Выберите файл..")}
                    {...register("file", {
                      validate: (files) => {
                        if (!files?.length) return true;
                        return (
                          isAllowedMaterialFile(files[0]) ||
                          t("Можно загрузить только PDF или изображения")
                        );
                      },
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Можно загрузить PDF или изображение. Рекомендуется PDF.")}
                  </p>
                  {errors.file && (
                    <span className="text-xs text-red-500">
                      {String(errors.file.message)}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full mt-4" disabled={isPending}>
                  <LuCloudUpload />{" "}
                  {isPending ? t("Загрузка...") : t("Загрузить материал")}
                </Button>
              </div>
            </form>
          </TabsContent>
          )}

          <TabsContent value="text" className="flex min-h-0 flex-col overflow-hidden">
            <form
              onSubmit={handleTextSubmit(onSubmitText, onFormInvalid)}
              className="flex min-h-0 flex-1 flex-col gap-4 pt-2"
            >
              <div className="flex shrink-0 flex-col gap-2">
                <FieldLabel htmlFor="text-description" required>
                  {t("Описание материала")}
                </FieldLabel>
                <Input
                  id="text-description"
                  type="text"
                  placeholder={t("Введите описание")}
                  {...registerText("description", requiredField(t("Заполните описание материала")))}
                />
                {textErrors.description && (
                  <span className="text-xs text-red-500">
                    {String(textErrors.description.message)}
                  </span>
                )}
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <FieldLabel required>{t("Текст материала")}</FieldLabel>
                {editorSeed ? (
                  <RichTextEditor
                    key={editorSeed}
                    initialContent={html}
                    onChange={setHtml}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {materialId && !isLoadingMaterial && !existing
                      ? t("Текст материала не найден")
                      : t("Загрузка текста...")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full mt-4" disabled={isSavingText || !editorSeed}>
                  <LuFileText />{" "}
                  {isSavingText
                    ? t("Сохранение...")
                    : editing
                      ? t("Сохранить изменения")
                      : t("Сохранить текст")}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </section>
  );
};

export default Add_Material_file;
