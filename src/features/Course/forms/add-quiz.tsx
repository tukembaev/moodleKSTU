import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { LuBookDashed, LuImage, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import CheckboxCard from "shared/components/CheckboxCard";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import { Checkbox } from "shared/shadcn/ui/checkbox";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";

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
  required: boolean;
  timeLimit: number;
  maxPoints: number;
  showCorrectAnswers: boolean;
  theme_id?: string;
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
      maxPoints: 100,
      showCorrectAnswers: false,
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

  const [searchParams] = useSearchParams();
  const formParam = searchParams.get("form");

  const { mutate: createTest, isPending } = testQueries.create_test_with_formdata();

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

  const params = new URLSearchParams(location.search);

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const theme_id = params.get("theme_id");
  const onSubmit = (formData: QuizFormData) => {
    // Подготовка JSON данных согласно спецификации API
    const testData = {
      title: formData.title,
      description: formData.description || "",
      opening_date: formData.opening_date.toISOString(),
      deadline: formData.deadline.toISOString(),
      required: formData.required || false,
      timeLimit: formData.timeLimit,
      maxPoints: formData.maxPoints || 0,
      showCorrectAnswers: formData.showCorrectAnswers || false,
      ...(theme_id ? { theme_id: theme_id } : {}),
      questions: formData.questions.map((question) => ({
        question: question.question,
        multipleAnswers: question.multipleAnswers || false,
        correctAnswer: question.multipleAnswers && Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : typeof question.correctAnswer === "string"
          ? question.correctAnswer
          : "",
        options: question.options
          .filter((opt) => opt.text.trim() !== "")
          .map((option) => ({
            text: option.text,
          })),
      })),
    };

    // Создание FormData
    const formDataToSend = new FormData();
    
    // Добавление JSON данных в поле 'data'
    formDataToSend.append("data", JSON.stringify(testData));

    // Добавление медиа файлов
    formData.questions.forEach((question, qIndex) => {
      // Изображение вопроса
      if (question.questionImage) {
        formDataToSend.append(`questions[${qIndex}][questionImage]`, question.questionImage);
      }

      // Изображения вариантов ответов
      question.options.forEach((option, oIndex) => {
        if (option.image) {
          formDataToSend.append(`questions[${qIndex}][options][${oIndex}][image]`, option.image);
        }
      });
    });

    // Отправка данных
    createTest(formDataToSend, {
      onSuccess: () => {
        navigate(-1);
      },
    });
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
        <div>
          <Label className="pb-2">Максимальное количество баллов</Label>
          <Input
            type="number"
            {...register("maxPoints", { required: true, min: 0, valueAsNumber: true })}
            placeholder="Например, 100"
          />
          {errors.maxPoints && (
            <p className="text-destructive">Минимум 0 баллов</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="showCorrectAnswers"
            {...register("showCorrectAnswers")}
            onCheckedChange={(checked) => setValue("showCorrectAnswers", !!checked)}
          />
          <Label
            htmlFor="showCorrectAnswers"
            className="text-sm font-normal cursor-pointer"
          >
            Показывать правильные ответы после отправки
          </Label>
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
          <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isPending}>
            Назад
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Создание..." : "Создать тест"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Add_Quiz;
