import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreateThemePayload } from "../../model/types/course_payload";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { TYPE_LESS } from "./add-theme-constants";

export const useAddThemeForm = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateThemePayload>();

  const id = searchParams.get("id");

  // Get all tests
  const { data: allTests } = useQuery(testQueries.allTest("/"));

  const userTests = useMemo(() => {
    if (!allTests) return [];
    return allTests;
  }, [allTests]);

  // Initialize form from URL params
  useEffect(() => {
    if (id) {
      setValue("week", id);
    }
  }, [id, setValue]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setValue("type_less", TYPE_LESS[value]);
  };

  const isTestType = selectedType === "test";

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    selectedType,
    handleTypeChange,
    isTestType,
    userTests,
  };
};

