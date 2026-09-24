import { useQuery } from "@tanstack/react-query";
import { Search, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  QUESTION_TYPE_LABELS,
  resolveQuestionType,
  type QuestionDraft,
} from "shared/components/QuestionEditor";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { Tabs, TabsList, TabsTrigger } from "shared/shadcn/ui/tabs";
import { sampleRandomIds } from "../lib/sampleRandom";
import { bankQuestionToInsertDraft } from "../model/services/questionBankAPI";
import { questionBankQueries } from "../model/services/questionBankQueryFactory";
import {
  bankQuestionsCount,
  type BankQuestion,
} from "../model/types/questionBank";

interface PickQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (questions: QuestionDraft[]) => void;
}

type PickMode = "manual" | "random";

const DEFAULT_SAMPLE_SIZE = "5";

const PickQuestionsDialog = ({
  open,
  onOpenChange,
  onInsert,
}: PickQuestionsDialogProps) => {
  const { t } = useTranslation();
  const { data: banks = [], isLoading } = useQuery({
    ...questionBankQueries.allBanks(),
    enabled: open,
  });
  const [bankId, setBankId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isInserting, setIsInserting] = useState(false);
  const [mode, setMode] = useState<PickMode>("manual");
  const [sampleSize, setSampleSize] = useState(DEFAULT_SAMPLE_SIZE);
  const [hasGenerated, setHasGenerated] = useState(false);

  const { data: selectedBank, isLoading: isBankLoading } = useQuery({
    ...questionBankQueries.bank(bankId || null),
    enabled: open && !!bankId,
  });

  const questions = useMemo(() => {
    const list = selectedBank?.questions ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => item.question.toLowerCase().includes(q));
  }, [selectedBank, search]);

  const visibleQuestions = useMemo(() => {
    if (selected.size === 0) return questions;
    const picked: BankQuestion[] = [];
    const rest: BankQuestion[] = [];
    questions.forEach((question) => {
      if (selected.has(question.id)) picked.push(question);
      else rest.push(question);
    });
    return [...picked, ...rest];
  }, [questions, selected]);

  const availableCount = questions.length;
  const parsedSampleSize = Number.parseInt(sampleSize, 10);
  const sampleCount = Number.isFinite(parsedSampleSize) ? parsedSampleSize : 0;
  const canGenerate =
    !!bankId &&
    !isBankLoading &&
    availableCount > 0 &&
    sampleCount >= 1;

  const toggle = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const resetTransientState = () => {
    setSelected(new Set());
    setSearch("");
    setMode("manual");
    setSampleSize(DEFAULT_SAMPLE_SIZE);
    setHasGenerated(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetTransientState();
    onOpenChange(next);
  };

  const generateSample = () => {
    if (!canGenerate) return;
    const ids = sampleRandomIds(
      questions.map((question) => question.id),
      sampleCount
    );
    setSelected(new Set(ids));
    setHasGenerated(true);
  };

  const insertSelected = async () => {
    if (!selectedBank) return;
    setIsInserting(true);
    try {
      const picked = selectedBank.questions.filter((item) =>
        selected.has(item.id)
      );
      const drafts = await Promise.all(picked.map(bankQuestionToInsertDraft));
      onInsert(drafts);
      handleOpenChange(false);
    } finally {
      setIsInserting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("Добавить из коллекции вопросов")}</DialogTitle>
          <DialogDescription>
            {t(
              "Выберите коллекцию и отметьте вопросы вручную или сгенерируйте случайную выборку. В тест попадут выбранные вопросы как обычный список."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as PickMode)}
          >
            <TabsList className="w-full">
              <TabsTrigger value="manual" className="flex-1">
                {t("Вручную")}
              </TabsTrigger>
              <TabsTrigger value="random" className="flex-1">
                {t("Случайная выборка")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("Коллекция")}</FieldLabel>
            <Select
              value={bankId}
              onValueChange={(value) => {
                setBankId(value);
                setSelected(new Set());
                setHasGenerated(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoading ? t("Загрузка...") : t("Выберите коллекцию")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name} ({bankQuestionsCount(bank)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoading && banks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t("Сначала создайте коллекцию на странице «Коллекция вопросов».")}
              </p>
            )}
          </div>

          {bankId && (
            <>
              {mode === "random" && (
                <div className="rounded-md border p-3">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex min-w-28 flex-1 flex-col gap-2">
                      <FieldLabel htmlFor="random-sample-size" required>
                        {t("Количество вопросов")}
                      </FieldLabel>
                      <Input
                        id="random-sample-size"
                        type="number"
                        min={1}
                        max={Math.max(availableCount, 1)}
                        inputMode="numeric"
                        value={sampleSize}
                        onChange={(e) => setSampleSize(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant={hasGenerated ? "outline" : "default"}
                      disabled={!canGenerate}
                      onClick={generateSample}
                    >
                      <Shuffle className="h-4 w-4" />
                      {hasGenerated ? t("Перегенерировать") : t("Сгенерировать")}
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isBankLoading
                      ? t("Загрузка вопросов...")
                      : availableCount === 0
                        ? t("В текущем фильтре нет вопросов для выборки.")
                        : t(
                            "Доступно в выборке: {{count}}. Случайные вопросы подставятся в список ниже, как если бы вы отметили их вручную.",
                            { count: availableCount }
                          )}
                  </p>
                  {hasGenerated && selected.size > 0 && (
                    <p className="mt-1 text-sm">
                      {t(
                        "Выбрано {{selected}} из {{total}}. Можно перегенерировать или поправить отметки до вставки.",
                        { selected: selected.size, total: availableCount }
                      )}
                    </p>
                  )}
                </div>
              )}

              <ScrollArea className="h-72 rounded-md border">
                <div className="sticky top-0 z-10 bg-background px-2 pt-2 pb-1">
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("Поиск по тексту вопроса")}
                      className="h-8 rounded-none border-0  bg-transparent px-2 pl-8 shadow-none focus-visible:border-0 focus-visible:ring-0"
                      aria-label={t("Поиск по тексту вопроса")}
                    />
                  </div>
                </div>
                <div className="space-y-1 px-2 pb-2">
                  {isBankLoading ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      {t("Загрузка вопросов...")}
                    </p>
                  ) : visibleQuestions.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      {t("Вопросы не найдены")}
                    </p>
                  ) : (
                    visibleQuestions.map((question) => (
                      <label
                        key={question.id}
                        className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selected.has(question.id)}
                          onCheckedChange={(checked) =>
                            toggle(question.id, !!checked)
                          }
                          className="mt-0.5"
                        />
                        <span className="min-w-0 flex-1 text-sm">
                          {question.question}
                          <Badge variant="secondary" className="ml-2">
                            {QUESTION_TYPE_LABELS[resolveQuestionType(question)]}
                          </Badge>
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            {t("Отмена")}
          </Button>
          <Button
            type="button"
            disabled={selected.size === 0 || isInserting}
            onClick={insertSelected}
          >
            {isInserting
              ? t("Вставка...")
              : t("Вставить ({{count}})", { count: selected.size })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PickQuestionsDialog;
