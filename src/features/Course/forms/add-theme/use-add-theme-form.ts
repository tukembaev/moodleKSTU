import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreateThemePayload } from "../../model/types/course_payload";
import { testQueries } from "entities/Test/model/services/testQueryFactory";

export const useAddThemeForm = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  
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

  const typeParam = searchParams.get("type");

  // Get all tests
  const { data: allTests } = useQuery(testQueries.allTest("/"));

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

