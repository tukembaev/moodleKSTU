import { RulesInfo } from "entities/Course/model/types/courseAbout";
import { FC, useState } from "react";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import {
  CheckCircle2,
  GraduationCap,
  LucideEdit,
  Plus,
  Trash2,
  X,
  Save,
} from "lucide-react";

const MAX_ITEMS = 8;
const EMPTY_MESSAGE = "Автор курса пока не добавил условия для прохождения теста.";

interface TestConditionsProps {
  rules: RulesInfo;
  isOwner: boolean;
  onSave?: (requirements: string[]) => void;
  // TODO: Add PATCH mutation when API is ready
  // onPatch?: (data: { rules: { requirements: string[] } }) => void;
}

export const TestConditions: FC<TestConditionsProps> = ({
  rules: initialRules,
  isOwner,
  onSave,
}) => {
  const [requirements, setRequirements] = useState<string[]>(
    initialRules.requirements || []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draftRequirements, setDraftRequirements] = useState<string[]>(
    initialRules.requirements || []
  );
  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateRequirements = (items: string[]): boolean => {
    const newErrors: Record<number, string> = {};

    items.forEach((item, index) => {
      if (!item.trim()) {
        newErrors[index] = "Условие не может быть пустым";
      } else if (item.length < 3) {
        newErrors[index] = "Минимум 3 символа";
      } else if (item.length > 200) {
        newErrors[index] = "Максимум 200 символов";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setDraftRequirements([...requirements]);
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setDraftRequirements([...requirements]);
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateRequirements(draftRequirements)) return;

    setRequirements(draftRequirements);
    setIsEditing(false);

    // TODO: Call PATCH API here
    // onPatch?.({ rules: { requirements: draftRequirements } });
    onSave?.(draftRequirements);
  };

  const handleItemChange = (index: number, value: string) => {
    setDraftRequirements((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
    // Clear error when user starts typing
    if (errors[index]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleDeleteItem = (index: number) => {
    setDraftRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    if (draftRequirements.length >= MAX_ITEMS) return;
    setDraftRequirements((prev) => [...prev, ""]);
  };

  const canAddMore = draftRequirements.length < MAX_ITEMS;
  const isEmpty = requirements.length === 0 && !isEditing;
  const isAvailable = initialRules.available || requirements.length > 0;

  if (!isAvailable && !isOwner) return null;

  return (
    <Card className="overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1" />
            <GraduationCap className="h-12 w-12 text-primary" />
            <div className="flex-1 flex justify-end">
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
          </div>

          <h4 className="text-lg font-semibold">Условия для прохождения теста</h4>
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Чтобы завершить курс вам потребуется выполнить следующие условия:
            {isEditing && (
              <span className="ml-2 text-xs">
                ({draftRequirements.length}/{MAX_ITEMS})
              </span>
            )}
          </p>

          {isEmpty ? (
            <div className="flex items-center justify-center p-4 text-muted-foreground text-center">
              <p>{EMPTY_MESSAGE}</p>
            </div>
          ) : isEditing ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {draftRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-lg bg-background/60 border border-border"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-2.5" />
                  <div className="flex-1">
                    <Input
                      value={req}
                      onChange={(e) => handleItemChange(idx, e.target.value)}
                      placeholder="Условие прохождения"
                      className={errors[idx] ? "border-red-500" : ""}
                    />
                    {errors[idx] && (
                      <p className="text-xs text-red-500 mt-1">{errors[idx]}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => handleDeleteItem(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {/* Add button in empty grid slot */}
              {canAddMore && (
                <button
                  onClick={handleAddItem}
                  className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-colors text-primary"
                >
                  <Plus className="h-5 w-5" />
                  <span>Добавить условие</span>
                </button>
              )}
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm p-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestConditions;
