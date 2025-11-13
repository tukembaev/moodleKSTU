import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuBookDashed } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UseMultiSelect } from "shared/components";
import CheckboxCard from "shared/components/CheckboxCard";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";

interface QuestionForm {
  question: string;

  options: string[];
  correctAnswer: string;
}

interface QuizFormData {
  title: string;
  description: string;
  opening_date: Date;
  deadline: Date;
  course: string[];
  required: boolean;
  timeLimit: number;
  questions: QuestionForm[];
}

const Add_Quiz = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    defaultValues: {
      questions: [
        {
          question: "",
          options: ["", ""],
          correctAnswer: "",
        },
        {
          question: "",
          options: ["", ""],
          correctAnswer: "",
        },
      ],
    },
  });

  const { data } = useQuery(courseQueries.allCourses());
  const [searchParams] = useSearchParams();
  const formParam = searchParams.get("form");

  // const { mutate: add_test, isPending } = testQueries.create_test();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const options = [
    {
      label: "Обязательный",
      description: "Для выставления балла студенту требуется пройти этот тест",
      value: "required",
      icon: LuBookDashed,
    },
  ];

  const selectedValues = watch("required") ? ["required"] : [];

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setValue("required", checked);
  };

  const [date] = useState<Date | undefined>(new Date());
  const [opening_date] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setValue("deadline", date!);
  }, [date, setValue]);

  useEffect(() => {
    setValue("opening_date", opening_date!);
  }, [opening_date, setValue]);

  const courseOptions =
    data?.map((course) => ({
      label: course.discipline_name,
      value: String(course.id),
      icon: course.category_icon,
    })) || [];

  useEffect(() => {
    setValue(
      "course",
      selectedCourses.map((id) => id)
    );
  }, [selectedCourses, setValue]);

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data: QuizFormData) => {
    const formatted = {
      quizId: `quiz_${Date.now()}`,
      title: data.title,
      timeLimit: data.timeLimit * 60,
      questions: data.questions.map((q, index) => ({
        id: `q${index + 1}`,
        ...q,
      })),
    };

    console.log("Создана викторина:", formatted);
  };

  const watchQuestions = watch("questions");

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="pb-2">Название викторины</Label>
          <Input
            {...register("title", { required: true })}
            placeholder="Название викторины"
          />
          {errors.title && <p className="text-destructive">Обязательно</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Описание</Label>
          <Input
            type="text"
            placeholder="Введите описание"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span className="text-xs text-red-500">Описание обязательно</span>
          )}
        </div>
        {formParam?.includes("choose-test") && (
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="deadline">
              Выберите курсы для закрепления теста
            </Label>
            <UseMultiSelect
              options={courseOptions}
              onValueChange={setSelectedCourses}
              defaultValue={selectedCourses}
              placeholder="Выберите курсы"
              variant="default"
              animation={2}
              maxCount={3}
            />
          </div>
        )}

        <div>
          <Label className="pb-2">Время на прохождение (в минутах)</Label>
          <Input
            type="number"
            {...register("timeLimit", { required: true, min: 1 })}
            placeholder="Например, 2"
          />
          {errors.timeLimit && (
            <p className="text-destructive">Минимум 1 минута</p>
          )}
        </div>
        {!formParam?.includes("choose-test") && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="locked">Дополнительно</Label>
            <CheckboxCard
              options={options}
              selectedValues={selectedValues}
              onChange={handleCheckboxChange}
            />
          </div>
        )}

        <div className="space-y-4 pt-2">
          {questionFields.map((field, qIndex) => {
            const options = watchQuestions[qIndex]?.options || [];

            return (
              <div key={field.id} className="border p-4 rounded-md space-y-4">
                <Label>Вопрос {qIndex + 1}</Label>
                <Input
                  {...register(`questions.${qIndex}.question`, {
                    required: true,
                  })}
                  placeholder="Введите текст вопроса"
                />

                <div className="space-y-2">
                  {options.map((_, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <Input
                        {...register(`questions.${qIndex}.options.${oIndex}`, {
                          required: true,
                        })}
                        placeholder={`Вариант ${oIndex + 1}`}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const updated = [...options];
                            updated.splice(oIndex, 1);
                            setValue(`questions.${qIndex}.options`, updated);
                            if (
                              watchQuestions[qIndex].correctAnswer ===
                              options[oIndex]
                            ) {
                              setValue(`questions.${qIndex}.correctAnswer`, "");
                            }
                          }}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  {options.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setValue(`questions.${qIndex}.options`, [
                          ...options,
                          "",
                        ])
                      }
                    >
                      Добавить вариант
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Правильный ответ</Label>
                  <select
                    {...register(`questions.${qIndex}.correctAnswer`, {
                      required: true,
                    })}
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="">Выберите вариант</option>
                    {options
                      .filter((opt) => opt.trim() !== "")
                      .map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                </div>

                {questionFields.length > 2 && (
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => remove(qIndex)}
                  >
                    Удалить вопрос
                  </Button>
                )}
              </div>
            );
          })}

          {questionFields.length < 4 && (
            <Button
              type="button"
              onClick={() =>
                append({
                  question: "",
                  options: ["", ""],
                  correctAnswer: "",
                })
              }
            >
              Добавить вопрос
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Button type="submit">Создать тест</Button>
        </div>
      </form>
    </Card>
  );
};

export default Add_Quiz;
