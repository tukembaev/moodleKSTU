import { LearningOutcome } from "shared/mocks/aboutCourseMock";
import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "shared/shadcn/ui/card";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { CheckCircle2, LucideEdit, Plus, Trash2, X, Save } from "lucide-react";
import { generateTempId, prepareDataForApi } from "shared/utils/entityUtils";

const MAX_ITEMS = 6;
const EMPTY_MESSAGE = "Автор курса пока не добавил информацию о том, чему вы научитесь на этом курсе.";

interface WhatYouWillLearnProps {
  outcomes: LearningOutcome[];
  isOwner: boolean;
  onSave?: (outcomes: LearningOutcome[]) => void;
  // TODO: Add PATCH mutation when API is ready
  // onPatch?: (data: { learningOutcomes: LearningOutcome[] }) => void;
}

export const WhatYouWillLearn: FC<WhatYouWillLearnProps> = ({
  outcomes: initialOutcomes,
  isOwner,
  onSave,
}) => {
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>(initialOutcomes);
  const [isEditing, setIsEditing] = useState(false);
  const [draftOutcomes, setDraftOutcomes] = useState<LearningOutcome[]>(initialOutcomes);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateOutcomes = (items: LearningOutcome[]): boolean => {
    const newErrors: Record<string, string> = {};

    items.forEach((item) => {
      if (!item.title.trim()) {
        newErrors[item.id] = "Название не может быть пустым";
      } else if (item.title.length < 3) {
        newErrors[item.id] = "Минимум 3 символа";
      } else if (item.title.length > 150) {
        newErrors[item.id] = "Максимум 150 символов";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setDraftOutcomes([...outcomes]);
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setDraftOutcomes([...outcomes]);
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateOutcomes(draftOutcomes)) return;

    setOutcomes(draftOutcomes);
    setIsEditing(false);

    // Prepare data for API - remove IDs from new items
    const apiData = prepareDataForApi(draftOutcomes);
    onSave?.(apiData as LearningOutcome[]);
  };

  const handleItemChange = (id: string, field: keyof LearningOutcome, value: string) => {
    setDraftOutcomes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    setDraftOutcomes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    if (draftOutcomes.length >= MAX_ITEMS) return;

    const newItem: LearningOutcome = {
      id: generateTempId(),
      title: "",
      description: "",
    };
    setDraftOutcomes((prev) => [...prev, newItem]);
  };

  const canAddMore = draftOutcomes.length < MAX_ITEMS;
  const isEmpty = outcomes.length === 0 && !isEditing;

  // Calculate grid positions for add button
  const getGridItems = () => {
    const items = [...draftOutcomes];
    const totalSlots = MAX_ITEMS;
    const filledSlots = items.length;
    const emptySlots = totalSlots - filledSlots;

    return { items, emptySlots, canAddMore: filledSlots < MAX_ITEMS };
  };

  const { items: gridItems } = getGridItems();

  return (
    <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-900/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            Чему вы научитесь
          </div>
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
        </CardTitle>
        <CardDescription>
          Навыки и компетенции, которые вы получите
          {isEditing && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({draftOutcomes.length}/{MAX_ITEMS})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground text-center">
            <p>{EMPTY_MESSAGE}</p>
          </div>
        ) : isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gridItems.map((outcome) => (
              <div
                key={outcome.id}
                className="flex flex-col gap-2 p-3 rounded-lg bg-background/60 border border-border"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-2" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={outcome.title}
                      onChange={(e) => handleItemChange(outcome.id, "title", e.target.value)}
                      placeholder="Название навыка"
                      className={errors[outcome.id] ? "border-red-500" : ""}
                    />
                    {errors[outcome.id] && (
                      <p className="text-xs text-red-500">{errors[outcome.id]}</p>
                    )}
                    <Input
                      value={outcome.description || ""}
                      onChange={(e) => handleItemChange(outcome.id, "description", e.target.value)}
                      placeholder="Описание (необязательно)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => handleDeleteItem(outcome.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {/* Add button in empty grid slot */}
            {canAddMore && (
              <button
                onClick={handleAddItem}
                className="flex items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors text-green-600 dark:text-green-400"
              >
                <Plus className="h-5 w-5" />
                <span>Добавить пункт</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outcomes.map((outcome) => (
              <div
                key={outcome.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/60 hover:bg-background transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{outcome.title}</p>
                  {outcome.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {outcome.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatYouWillLearn;
