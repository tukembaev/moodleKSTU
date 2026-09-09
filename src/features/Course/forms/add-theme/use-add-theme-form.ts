import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreateThemePayload } from "../../model/types/course_payload";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { useFormParam } from "shared/hooks";
import { useCourseId } from "shared/lib/navigation/hidden-ids";

export const useAddThemeForm = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const formCourseId = useFormParam("id");
  const storedCourseId = useCourseId();
  const courseId = formCourseId || storedCourseId;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<CreateThemePayload>({
    defaultValues: {
      course: courseId || "",
      week: 1,
      locked: false,
    }
  });

  const typeParam = useFormParam("type");

  // Get all tests
  const { data: allTests } = useQuery(testQueries.allTest());

  const userTests = useMemo(() => {
    if (!allTests) return [];
    return allTests;
  }, [allTests]);

  // Предустановка типа из URL параметра - only once
  useEffect(() => {
    if (typeParam) {
      setSelectedType(typeParam);
      setValue("type_less", typeParam);
    }
  }, [typeParam, setValue]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setValue("type_less", value);
  };

  const isTestType = selectedType === "Тест";

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    control,
    selectedType,
    handleTypeChange,
    isTestType,
    userTests,
  };
};

