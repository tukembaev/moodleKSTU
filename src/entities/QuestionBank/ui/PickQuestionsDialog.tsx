import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { QuestionDraft } from "shared/components/QuestionEditor";
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
import { Label } from "shared/shadcn/ui/label";
import { ScrollArea } from "shared/shadcn/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/shadcn/ui/select";
import { bankQuestionToDraft } from "../model/services/questionBankAPI";
import { questionBankQueries } from "../model/services/questionBankQueryFactory";

interface PickQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (questions: QuestionDraft[]) => void;
}

const PickQuestionsDialog = ({
  open,
  onOpenChange,
  onInsert,
}: PickQuestionsDialogProps) => {
  const { data: banks = [], isLoading } = useQuery({
    ...questionBankQueries.allBanks(),
    enabled: open,
  });
  const [bankId, setBankId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isInserting, setIsInserting] = useState(false);

  const selectedBank = banks.find((bank) => bank.id === bankId);
  const questions = useMemo(() => {
    const list = selectedBank?.questions ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => item.question.toLowerCase().includes(q));
  }, [selectedBank, search]);

  const toggle = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelected(new Set());
      setSearch("");
    }
    onOpenChange(next);
  };

  const insertSelected = async () => {
    if (!selectedBank) return;
    setIsInserting(true);
    try {
      const picked = selectedBank.questions.filter((item) =>
        selected.has(item.id)
      );
      const drafts = await Promise.all(picked.map(bankQuestionToDraft));
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
          <DialogTitle>Добавить из коллекции вопросов</DialogTitle>
          <DialogDescription>
            Выберите Коллекция и отметьте вопросы, которые нужно вставить в тест.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label>Коллекция</Label>
            <Select
              value={bankId}
              onValueChange={(value) => {
                setBankId(value);
                setSelected(new Set());
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={isLoading ? "Загрузка..." : "Выберите Коллекция"}
                />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name} ({bank.questions.length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoading && banks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Сначала создайте Коллекция на странице «Коллекция вопросов».
              </p>
            )}
          </div>

          {selectedBank && (
            <>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по тексту вопроса"
              />
              <ScrollArea className="h-72 rounded-md border">
                <div className="space-y-1 p-2">
                  {questions.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      Вопросы не найдены
                    </p>
                  ) : (
                    questions.map((question) => (
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
                          {question.multipleAnswers && (
                            <Badge variant="secondary" className="ml-2">
                              Несколько ответов
                            </Badge>
                          )}
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
            Отмена
          </Button>
          <Button
            type="button"
            disabled={selected.size === 0 || isInserting}
            onClick={insertSelected}
          >
            {isInserting ? "Вставка..." : `Вставить (${selected.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PickQuestionsDialog;
