import { CourseFAQ } from "shared/mocks/aboutCourseMock";
import { FC, useState } from "react";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Textarea } from "shared/shadcn/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import {
  MessageCircle,
  LucideEdit,
  Plus,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { generateTempId, prepareDataForApi } from "shared/utils/entityUtils";

const EMPTY_MESSAGE = "Автор курса пока не добавил часто задаваемые вопросы.";

interface FAQProps {
  faq: CourseFAQ[];
  isOwner: boolean;
  onSave?: (faq: CourseFAQ[]) => void;
  // TODO: Add PATCH mutation when API is ready
  // onPatch?: (data: { faq: CourseFAQ[] }) => void;
}

export const FAQ: FC<FAQProps> = ({
  faq: initialFaq,
  isOwner,
  onSave,
}) => {
  const [faq, setFaq] = useState<CourseFAQ[]>(initialFaq);
  const [isEditing, setIsEditing] = useState(false);
  const [draftFaq, setDraftFaq] = useState(initialFaq);
  const [errors, setErrors] = useState<Record<string, { question?: string; answer?: string }>>({});

  const validateFaq = (items: CourseFAQ[]): boolean => {
    const newErrors: Record<string, { question?: string; answer?: string }> = {};

    items.forEach((item) => {
      const itemErrors: { question?: string; answer?: string } = {};

      if (!item.question.trim()) {
        itemErrors.question = "Вопрос не может быть пустым";
      } else if (item.question.length < 5) {
        itemErrors.question = "Минимум 5 символов";
      } else if (item.question.length > 200) {
        itemErrors.question = "Максимум 200 символов";
      }

      if (!item.answer.trim()) {
        itemErrors.answer = "Ответ не может быть пустым";
      } else if (item.answer.length < 10) {
        itemErrors.answer = "Минимум 10 символов";
      } else if (item.answer.length > 1000) {
        itemErrors.answer = "Максимум 1000 символов";
      }

      if (Object.keys(itemErrors).length > 0) {
        newErrors[item.id] = itemErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setDraftFaq([...faq]);
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setDraftFaq([...faq]);
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateFaq(draftFaq)) return;

    setFaq(draftFaq);
    setIsEditing(false);

    // Prepare data for API - remove IDs from new items
    const apiData = prepareDataForApi(draftFaq);
    onSave?.(apiData as CourseFAQ[]);
  };

  const handleItemChange = (id: string, field: keyof CourseFAQ, value: string) => {
    setDraftFaq((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    // Clear error when user starts typing
    if (errors[id]?.[field as 'question' | 'answer']) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[id]) {
          delete newErrors[id][field as 'question' | 'answer'];
          if (Object.keys(newErrors[id]).length === 0) {
            delete newErrors[id];
          }
        }
        return newErrors;
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    setDraftFaq((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const newItem: CourseFAQ = {
      id: generateTempId(),
      question: "",
      answer: "",
    };
    setDraftFaq((prev) => [...prev, newItem]);
  };

  const isEmpty = faq.length === 0 && !isEditing;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          Часто задаваемые вопросы
        </h2>
        {isOwner && !isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0 h-8 w-8"
            onClick={handleEdit}
          >
            <LucideEdit className="h-4 w-4" />
          </Button>
        )}
        {isOwner && isEditing && (
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Сохранить
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Отменить
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent>
          {isEmpty ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground text-center">
              <p>{EMPTY_MESSAGE}</p>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              {draftFaq.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-border bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Вопрос</label>
                        <Input
                          value={item.question}
                          onChange={(e) => handleItemChange(item.id, "question", e.target.value)}
                          placeholder="Введите вопрос"
                          className={errors[item.id]?.question ? "border-red-500" : ""}
                        />
                        {errors[item.id]?.question && (
                          <p className="text-xs text-red-500 mt-1">{errors[item.id].question}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Ответ</label>
                        <Textarea
                          value={item.answer}
                          onChange={(e) => handleItemChange(item.id, "answer", e.target.value)}
                          placeholder="Введите ответ"
                          className={`min-h-[80px] ${errors[item.id]?.answer ? "border-red-500" : ""}`}
                        />
                        {errors[item.id]?.answer && (
                          <p className="text-xs text-red-500 mt-1">{errors[item.id].answer}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 shrink-0"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddItem}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-colors text-primary"
              >
                <Plus className="h-5 w-5" />
                <span>Добавить вопрос</span>
              </button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faq.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQ;
