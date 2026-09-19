import { ChangeEvent, useId } from "react";
import {
  AlignLeft,
  Check,
  CircleDot,
  ImagePlus,
  ListChecks,
  Plus,
  ToggleLeft,
  Trash2,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import { Label } from "shared/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { cn } from "shared/lib/utils";
import {
  applyQuestionType,
  emptyOptionDraft,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPES,
  resolveQuestionType,
  type QuestionDraft,
  type QuestionType,
} from "./types";

const QUESTION_TYPE_OPTIONS: Array<{
  type: QuestionType;
  shortLabel: string;
  icon: LucideIcon;
}> = [
  { type: "single_choice", shortLabel: "Один", icon: CircleDot },
  { type: "multiple_choice", shortLabel: "Несколько", icon: ListChecks },
  { type: "true_false", shortLabel: "Да/нет", icon: ToggleLeft },
  { type: "short_answer", shortLabel: "Короткий", icon: Type },
  { type: "essay", shortLabel: "Эссе", icon: AlignLeft },
];

interface QuestionEditorCardProps {
  value: QuestionDraft;
  onChange: (next: QuestionDraft) => void;
  index?: number;
  error?: string;
  canRemove?: boolean;
  onRemove?: () => void;
  onAddOption?: () => void;
}

const typeHint = (type: QuestionType) => {
  if (type === "multiple_choice") return "Отметьте все правильные варианты";
  if (type === "single_choice") return "Нажмите на вариант, чтобы отметить правильный ответ";
  if (type === "true_false") return "Выберите, какой ответ считается правильным";
  if (type === "short_answer") return "Укажите эталонный текст. Сверка без регистра и лишних пробелов";
  return "Студент напишет свободный ответ. Балл ставит преподаватель вручную";
};

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
  const questionType = resolveQuestionType(value);
  const options = value.options || [];
  const isMultipleMode = questionType === "multiple_choice";
  const showRemove = Boolean(onRemove) && (canRemove ?? true);
  const correctAnswers = Array.isArray(value.correctAnswer)
    ? value.correctAnswer
    : typeof value.correctAnswer === "string" && value.correctAnswer
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
    let nextCorrect: QuestionDraft["correctAnswer"] = value.correctAnswer;
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

  const trueFalseValue = value.correctAnswer === true;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base leading-snug font-medium">Вопрос {index + 1}</p>
          <p className="text-sm text-muted-foreground">{typeHint(questionType)}</p>
        </div>
        <div className="flex items-center gap-3">
          {showRemove && (
            <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Удалить вопрос">
              <Trash2 className="text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel id={`${uid}-type-label`} htmlFor={`${uid}-type`} required>
          Тип вопроса
        </FieldLabel>
        <div className="md:hidden">
          <Select
            value={questionType}
            onValueChange={(next) => update(applyQuestionType(value, next as QuestionType))}
          >
            <SelectTrigger id={`${uid}-type`} className="w-full min-h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          role="radiogroup"
          aria-labelledby={`${uid}-type-label`}
          className="hidden grid-cols-5 gap-2 md:grid"
        >
          {QUESTION_TYPE_OPTIONS.map(({ type, shortLabel, icon: Icon }) => {
            const isActive = questionType === type;
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={isActive}
                data-checked={isActive}
                onClick={() => update(applyQuestionType(value, type))}
                className={cn(
                  "flex min-h-11 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs font-medium outline-none transition-colors",
                  "hover:bg-muted/50",
                  isActive
                    ? "border-primary/40 bg-primary/[0.04] text-foreground"
                    : "border-input bg-transparent text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{shortLabel}</span>
              </button>
            );
          })}
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

      {questionType === "true_false" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { value: true, label: "Верно" },
            { value: false, label: "Неверно" },
          ].map((option) => {
            const isChecked = trueFalseValue === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                role="radio"
                aria-checked={isChecked}
                data-checked={isChecked}
                onClick={() => update({ ...value, correctAnswer: option.value })}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-input bg-transparent px-3 py-2.5 text-start text-sm outline-none select-none transition-colors",
                  "hover:bg-muted/50",
                  "data-[checked=true]:border-primary/40 data-[checked=true]:bg-primary/[0.04]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                >
                  {isChecked && <span className="size-2 rounded-full bg-primary-foreground" />}
                </span>
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {questionType === "short_answer" && (
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor={`${uid}-short-answer`} required>
            Эталонный ответ
          </FieldLabel>
          <Input
            id={`${uid}-short-answer`}
            value={typeof value.correctAnswer === "string" ? value.correctAnswer : ""}
            onChange={(e) => update({ ...value, correctAnswer: e.target.value })}
            placeholder="Например, Париж"
            className="min-h-11 rounded-xl"
          />
        </div>
      )}

      {questionType === "essay" && (
        <p className="rounded-xl border border-dashed px-3 py-2.5 text-sm text-muted-foreground">
          Правильный ответ не указывается. После сдачи вопрос попадёт преподавателю на ручную проверку.
        </p>
      )}

      {(questionType === "single_choice" || questionType === "multiple_choice") && (
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
      )}

      {(questionType === "single_choice" || questionType === "multiple_choice") &&
        options.length >= 6 && (
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
