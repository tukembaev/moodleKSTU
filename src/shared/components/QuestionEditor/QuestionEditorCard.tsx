import { ChangeEvent, useId } from "react";
import { Check, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { cn } from "shared/lib/utils";
import { emptyOptionDraft, type QuestionDraft } from "./types";

interface QuestionEditorCardProps {
  value: QuestionDraft;
  onChange: (next: QuestionDraft) => void;
  index?: number;
  error?: string;
  canRemove?: boolean;
  onRemove?: () => void;
  onAddOption?: () => void;
}

const QuestionEditorCard = ({
  value,
  onChange,
  index = 0,
  error,
  canRemove,
  onRemove,
  onAddOption,
}: QuestionEditorCardProps) => {
  const uid = useId();
  const options = value.options || [];
  const isMultipleMode = value.multipleAnswers || false;
  const showRemove = Boolean(onRemove) && (canRemove ?? true);
  const correctAnswers = Array.isArray(value.correctAnswer)
    ? value.correctAnswer
    : value.correctAnswer
      ? [value.correctAnswer]
      : [];

  const update = (next: QuestionDraft) => onChange(next);

  const handleQuestionImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update({
      ...value,
      questionImage: file,
      questionImagePreview: URL.createObjectURL(file),
    });
  };

  const handleOptionImageChange = (oIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updatedOptions = [...options];
    updatedOptions[oIndex] = {
      ...updatedOptions[oIndex],
      image: file,
      imagePreview: URL.createObjectURL(file),
    };
    update({ ...value, options: updatedOptions });
  };

  const handleMultipleAnswersToggle = (checked: boolean) => {
    update({
      ...value,
      multipleAnswers: checked,
      correctAnswer: checked ? [] : "",
    });
  };

  const toggleCorrect = (answer: string) => {
    if (!answer.trim()) return;
    if (isMultipleMode) {
      const updatedAnswers = correctAnswers.includes(answer)
        ? correctAnswers.filter((item) => item !== answer)
        : [...correctAnswers, answer];
      update({ ...value, correctAnswer: updatedAnswers });
      return;
    }
    update({ ...value, correctAnswer: correctAnswers.includes(answer) ? "" : answer });
  };

  const removeOption = (oIndex: number) => {
    const option = options[oIndex];
    const updated = options.filter((_, i) => i !== oIndex);
    let nextCorrect: string | string[] = value.correctAnswer;
    if (isMultipleMode) {
      nextCorrect = correctAnswers.filter((ans) => ans !== option.text);
    } else if (value.correctAnswer === option.text) {
      nextCorrect = "";
    }
    update({ ...value, options: updated, correctAnswer: nextCorrect });
  };

  const addOption = () => {
    if (onAddOption) {
      onAddOption();
      return;
    }
    update({
      ...value,
      options: [...options, emptyOptionDraft()],
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base leading-snug font-medium">Вопрос {index + 1}</p>
          <p className="text-sm text-muted-foreground">
            {isMultipleMode
              ? "Отметьте все правильные варианты"
              : "Нажмите на вариант, чтобы отметить правильный ответ"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${uid}-multiple`}
              checked={isMultipleMode}
              onCheckedChange={(checked) => handleMultipleAnswersToggle(!!checked)}
            />
            <Label htmlFor={`${uid}-multiple`} className="cursor-pointer text-sm font-normal">
              Несколько правильных
            </Label>
          </div>
          {showRemove && (
            <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Удалить вопрос">
              <Trash2 className="text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <Input
        value={value.question}
        onChange={(e) => update({ ...value, question: e.target.value })}
        placeholder="Введите текст вопроса"
        className="min-h-11 rounded-xl"
        aria-label={`Текст вопроса ${index + 1}`}
      />

      {value.questionImagePreview ? (
        <div className="relative w-fit">
          <img
            src={value.questionImagePreview}
            alt="Превью изображения вопроса"
            className="max-h-44 max-w-full rounded-xl border object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute -top-2 -right-2 rounded-full shadow-sm"
            aria-label="Убрать изображение вопроса"
            onClick={() =>
              update({ ...value, questionImage: null, questionImagePreview: undefined })
            }
          >
            <X />
          </Button>
        </div>
      ) : (
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleQuestionImageChange}
            className="hidden"
            id={`${uid}-question-image`}
          />
          <Label htmlFor={`${uid}-question-image`} className="cursor-pointer">
            <span className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 text-sm text-muted-foreground transition-colors hover:border-solid hover:text-foreground">
              <ImagePlus className="size-4" />
              Изображение к вопросу (необязательно)
            </span>
          </Label>
        </div>
      )}

      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {options.map((option, oIndex) => {
          const filled = option.text.trim() !== "";
          const isChecked = filled && correctAnswers.includes(option.text);
          return (
            <div
              key={option.id || oIndex}
              role={isMultipleMode ? "checkbox" : "radio"}
              aria-checked={isChecked}
              data-checked={isChecked}
              onClick={() => toggleCorrect(option.text)}
              className={cn(
                "group relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-xl border border-input bg-transparent px-3 py-2.5 text-start text-sm outline-none select-none transition-colors",
                "hover:bg-muted/50",
                "data-[checked=true]:border-primary/40 data-[checked=true]:bg-primary/[0.04]",
                !filled && "cursor-default"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none relative mt-0.5 flex size-4 shrink-0 items-center justify-center border transition-colors",
                  isMultipleMode ? "rounded-[4px]" : "rounded-full",
                  isChecked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input"
                )}
              >
                {isChecked &&
                  (isMultipleMode ? (
                    <Check className="size-3.5" />
                  ) : (
                    <span className="size-2 rounded-full bg-primary-foreground" />
                  ))}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start gap-1.5">
                  <Input
                    value={option.text}
                    onChange={(e) => {
                      const updatedOptions = [...options];
                      updatedOptions[oIndex] = {
                        ...updatedOptions[oIndex],
                        text: e.target.value,
                      };
                      update({ ...value, options: updatedOptions });
                    }}
                    placeholder={`Вариант ${oIndex + 1}`}
                    aria-label={`Вариант ${oIndex + 1} вопроса ${index + 1}`}
                    className="h-8 border-transparent bg-transparent px-1.5 shadow-none hover:border-input focus-visible:border-ring focus-visible:bg-background"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Удалить вариант ${oIndex + 1}`}
                      onClick={() => removeOption(oIndex)}
                    >
                      <X />
                    </Button>
                  )}
                </div>

                {option.imagePreview ? (
                  <div className="relative w-fit">
                    <img
                      src={option.imagePreview}
                      alt={`Изображение варианта ${oIndex + 1}`}
                      className="max-h-24 max-w-full rounded-lg border bg-background object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-xs"
                      className="absolute -top-2 -right-2 rounded-full shadow-sm"
                      aria-label="Убрать изображение варианта"
                      onClick={() => {
                        const updatedOptions = [...options];
                        updatedOptions[oIndex] = {
                          ...updatedOptions[oIndex],
                          image: null,
                          imagePreview: undefined,
                        };
                        update({ ...value, options: updatedOptions });
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleOptionImageChange(oIndex, e)}
                      className="hidden"
                      id={`${uid}-option-image-${oIndex}`}
                    />
                    <Label
                      htmlFor={`${uid}-option-image-${oIndex}`}
                      className="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ImagePlus className="size-3.5" />
                      Картинка
                    </Label>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="flex min-h-[88px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-sm text-muted-foreground transition-colors hover:border-solid hover:text-foreground"
          >
            <Plus className="size-5" />
            Добавить вариант
          </button>
        )}
      </div>

      {options.length >= 6 && (
        <p className="text-xs text-muted-foreground">Максимум 6 вариантов ответа</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default QuestionEditorCard;
