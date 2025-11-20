import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuBookDashed, LuX, LuImage } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UseMultiSelect } from "shared/components";
import CheckboxCard from "shared/components/CheckboxCard";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { Checkbox } from "shared/shadcn/ui/checkbox";

interface QuestionForm {
  question: string;
  questionImage?: File | null;
  questionImagePreview?: string;
  options: {
    text: string;
    image?: File | null;
    imagePreview?: string;
  }[];
  correctAnswer: string | string[]; // Может быть один или несколько ответов
  multipleAnswers: boolean; // Режим множественного выбора
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

const Add_Quiz = ({ chooseCourse = false }: { chooseCourse?: boolean } ) => {
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
           questionImage: null,
          questionImagePreview: undefined,
          options: [
            { text: "", image: null, imagePreview: undefined },
            { text: "", image: null, imagePreview: undefined },
          ],
          correctAnswer: "",
          multipleAnswers: false,
        },
        {
          question: "",
          questionImage: null,
          questionImagePreview: undefined,
          options: [
            { text: "", image: null, imagePreview: undefined },
            { text: "", image: null, imagePreview: undefined },
          ],
          correctAnswer: "",
          multipleAnswers: false,
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

  const handleCheckboxChange = (_value: string, checked: boolean) => {
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
    const formData = new FormData();

    // Основные поля
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("timeLimit", String(data.timeLimit * 60));
    formData.append("required", String(data.required || false));
    
    if (data.opening_date) {
      formData.append("opening_date", data.opening_date.toISOString());
    }
    if (data.deadline) {
      formData.append("deadline", data.deadline.toISOString());
    }
    
    // Курсы
    if (data.course && Array.isArray(data.course)) {
      data.course.forEach((courseId, index) => {
        formData.append(`course[${index}]`, courseId);
      });
    }

    // Вопросы
    data.questions.forEach((question, qIndex) => {
      formData.append(`questions[${qIndex}][question]`, question.question);
      formData.append(`questions[${qIndex}][multipleAnswers]`, String(question.multipleAnswers || false));
      
      // Изображение вопроса
      if (question.questionImage) {
        formData.append(`questions[${qIndex}][questionImage]`, question.questionImage);
      }

      // Правильный ответ (может быть строкой или массивом)
      if (question.multipleAnswers && Array.isArray(question.correctAnswer)) {
        question.correctAnswer.forEach((answer, aIndex) => {
          formData.append(`questions[${qIndex}][correctAnswer][${aIndex}]`, answer);
        });
      } else if (typeof question.correctAnswer === "string") {
        formData.append(`questions[${qIndex}][correctAnswer]`, question.correctAnswer);
      }

      // Варианты ответов
      question.options.forEach((option, oIndex) => {
        formData.append(`questions[${qIndex}][options][${oIndex}][text]`, option.text);
        
        // Изображение варианта ответа
        if (option.image) {
          formData.append(`questions[${qIndex}][options][${oIndex}][image]`, option.image);
        }
      });
    });

    console.log("FormData создан, готов к отправке" + formData);
    // Здесь можно добавить вызов API для отправки formData
    // Например: addQuiz(formData);
  };

  const handleQuestionImageChange = (
    qIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setValue(`questions.${qIndex}.questionImage`, file);
      setValue(`questions.${qIndex}.questionImagePreview`, preview);
    }
  };

  const handleOptionImageChange = (
    qIndex: number,
    oIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      const currentOptions = watchQuestions[qIndex]?.options || [];
      const updatedOptions = [...currentOptions];
      updatedOptions[oIndex] = {
        ...updatedOptions[oIndex],
        image: file,
        imagePreview: preview,
      };
      setValue(`questions.${qIndex}.options`, updatedOptions);
    }
  };

  const removeQuestionImage = (qIndex: number) => {
    setValue(`questions.${qIndex}.questionImage`, null);
    setValue(`questions.${qIndex}.questionImagePreview`, undefined);
  };

  const removeOptionImage = (qIndex: number, oIndex: number) => {
    const currentOptions = watchQuestions[qIndex]?.options || [];
    const updatedOptions = [...currentOptions];
    updatedOptions[oIndex] = {
      ...updatedOptions[oIndex],
      image: null,
      imagePreview: undefined,
    };
    setValue(`questions.${qIndex}.options`, updatedOptions);
  };

  const handleMultipleAnswersToggle = (qIndex: number, checked: boolean) => {
    setValue(`questions.${qIndex}.multipleAnswers`, checked);
    // Сбрасываем правильные ответы при переключении режима
    setValue(
      `questions.${qIndex}.correctAnswer`,
      checked ? [] : ""
    );
  };

  const handleCorrectAnswerChange = (
    qIndex: number,
    value: string,
    checked: boolean
  ) => {
    const question = watchQuestions[qIndex];
    if (question?.multipleAnswers) {
      const currentAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [];
      const updatedAnswers = checked
        ? [...currentAnswers, value]
        : currentAnswers.filter((ans) => ans !== value);
      setValue(`questions.${qIndex}.correctAnswer`, updatedAnswers);
    } else {
      setValue(`questions.${qIndex}.correctAnswer`, value);
    }
  };

  const watchQuestions = watch("questions");

  return (
    <Card className="p-6 h-full overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="pb-2">Название теста</Label>
          <Input
            {...register("title", { required: true })}
            placeholder="Название теста"
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
        {chooseCourse && (
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
            const question = watchQuestions[qIndex];
            const options = question?.options || [];
            const isMultipleMode = question?.multipleAnswers || false;
            const correctAnswers = Array.isArray(question?.correctAnswer)
              ? question.correctAnswer
              : question?.correctAnswer
                ? [question.correctAnswer]
                : [];

            return (
              <div key={field.id} className="border p-4 rounded-md space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Вопрос {qIndex + 1}</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`multiple-${qIndex}`}
                      checked={isMultipleMode}
                      onCheckedChange={(checked) =>
                        handleMultipleAnswersToggle(qIndex, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`multiple-${qIndex}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      Несколько правильных ответов
                    </Label>
                  </div>
                </div>

                <Input
                  {...register(`questions.${qIndex}.question`, {
                    required: true,
                  })}
                  placeholder="Введите текст вопроса"
                />

                {/* Загрузка изображения для вопроса */}
                <div className="space-y-2">
                  <Label>Изображение для вопроса (необязательно)</Label>
                  {question?.questionImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={question.questionImagePreview}
                        alt="Question preview"
                        className="max-w-xs max-h-48 rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0"
                        onClick={() => removeQuestionImage(qIndex)}
                      >
                        <LuX />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleQuestionImageChange(qIndex, e)}
                        className="hidden"
                        id={`question-image-${qIndex}`}
                      />
                      <Label
                        htmlFor={`question-image-${qIndex}`}
                        className="cursor-pointer"
                      >
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <LuImage className="mr-2" />
                            Загрузить изображение
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Варианты ответов</Label>
                  {options.map((option, oIndex) => (
                    <div key={oIndex} className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Input
                          {...register(
                            `questions.${qIndex}.options.${oIndex}.text`,
                            {
                              required: true,
                            }
                          )}
                          placeholder={`Вариант ${oIndex + 1}`}
                          className="flex-1"
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              const updated = [...options];
                              updated.splice(oIndex, 1);
                              setValue(`questions.${qIndex}.options`, updated);
                              // Удаляем из правильных ответов, если был выбран
                              if (isMultipleMode) {
                                const updatedAnswers = correctAnswers.filter(
                                  (ans) => ans !== option.text
                                );
                                setValue(
                                  `questions.${qIndex}.correctAnswer`,
                                  updatedAnswers
                                );
                              } else if (
                                question?.correctAnswer === option.text
                              ) {
                                setValue(`questions.${qIndex}.correctAnswer`, "");
                              }
                            }}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                      {/* Загрузка изображения для варианта ответа */}
                      <div className="flex items-center gap-2">
                        {option?.imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={option.imagePreview}
                              alt="Option preview"
                              className="max-w-xs max-h-32 rounded-md border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-0 right-0"
                              onClick={() => removeOptionImage(qIndex, oIndex)}
                            >
                              <LuX />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleOptionImageChange(qIndex, oIndex, e)
                              }
                              className="hidden"
                              id={`option-image-${qIndex}-${oIndex}`}
                            />
                            <Label
                              htmlFor={`option-image-${qIndex}-${oIndex}`}
                              className="cursor-pointer"
                            >
                              <Button type="button" variant="outline" size="sm" asChild>
                                <span>
                                  <LuImage className="mr-2 h-4 w-4" />
                                  Изображение
                                </span>
                              </Button>
                            </Label>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {options.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const currentOptions = watchQuestions[qIndex]?.options || [];
                        setValue(`questions.${qIndex}.options`, [
                          ...currentOptions,
                          { text: "", image: null, imagePreview: undefined },
                        ]);
                      }}
                    >
                      Добавить вариант
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Правильный ответ</Label>
                  {isMultipleMode ? (
                    <div className="space-y-2 mt-2">
                      {options
                        .filter((opt) => opt.text.trim() !== "")
                        .map((option, idx) => {
                          const isChecked = correctAnswers.includes(option.text);
                          return (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 p-2 border rounded"
                            >
                              <Checkbox
                                id={`answer-${qIndex}-${idx}`}
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handleCorrectAnswerChange(
                                    qIndex,
                                    option.text,
                                    !!checked
                                  )
                                }
                              />
                              <Label
                                htmlFor={`answer-${qIndex}-${idx}`}
                                className="flex-1 cursor-pointer"
                              >
                                {option.text}
                              </Label>
                              {option.imagePreview && (
                                <img
                                  src={option.imagePreview}
                                  alt="Option"
                                  className="max-w-16 max-h-16 rounded"
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <select
                      {...register(`questions.${qIndex}.correctAnswer`, {
                        required: true,
                      })}
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                      value={
                        typeof question?.correctAnswer === "string"
                          ? question.correctAnswer
                          : ""
                      }
                    >
                      <option value="">Выберите вариант</option>
                      {options
                        .filter((opt) => opt.text.trim() !== "")
                        .map((option, idx) => (
                          <option key={idx} value={option.text}>
                            {option.text}
                          </option>
                        ))}
                    </select>
                  )}
                  {errors.questions?.[qIndex]?.correctAnswer && (
                    <p className="text-destructive text-sm mt-1">
                      Выберите правильный ответ
                    </p>
                  )}
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
                  questionImage: null,
                  questionImagePreview: undefined,
                  options: [
                    { text: "", image: null, imagePreview: undefined },
                    { text: "", image: null, imagePreview: undefined },
                  ],
                  correctAnswer: "",
                  multipleAnswers: false,
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
