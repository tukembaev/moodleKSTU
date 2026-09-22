import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreateThemePayload } from "../../model/types/course_payload";
import { testQueries } from "entities/Test/model/services/testQueryFactory";
import { useFormParam } from "shared/hooks";
import { useCourseId } from "shared/lib/navigation/hidden-ids";
import { isGradableThemeType, isTestThemeType, resolveThemeTypeLabel } from "./add-theme-constants";
import { requiredField } from "shared/lib/onFormInvalid";

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
    unregister,
    clearErrors,
  } = useForm<CreateThemePayload>({
    defaultValues: {
      course: courseId || "",
      week: 1,
      locked: false,
      opening_date: null,
      deadline: null,
    }
  });

  const typeParam = useFormParam("type");

  // Get all tests
  const { data: allTests } = useQuery(testQueries.allTest());

  const userTests = useMemo(() => {
    if (!allTests) return [];
    return allTests;
  }, [allTests]);

  useEffect(() => {
    if (!typeParam || typeParam === "type_less") return;
    const nextType = resolveThemeTypeLabel(typeParam);
    setSelectedType(nextType);
    setValue("type_less", nextType, { shouldValidate: true });
    if (!isGradableThemeType(nextType)) {
      setValue("locked", false);
      setValue("max_points", 0);
      setValue("week", 1);
    }
  }, [typeParam, setValue]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setValue("type_less", value, { shouldValidate: true });
    clearErrors();
    if (!isGradableThemeType(value)) {
      setValue("locked", false);
      setValue("max_points", 0);
      setValue("week", 1);
    }
  };

  const isTestType = isTestThemeType(selectedType);
  const canReceivePoints = isGradableThemeType(selectedType);

  useEffect(() => {
    register("type_less", requiredField("Выберите тип занятия"));
  }, [register]);

  useEffect(() => {
    if (!canReceivePoints) {
      unregister("max_points");
      unregister("week");
    }
  }, [canReceivePoints, unregister]);

  useEffect(() => {
    if (!isTestType) {
      unregister("test_id");
      return;
    }
    unregister("title");
    unregister("description");
    unregister("max_points");
    unregister("week");
    register("test_id", requiredField("Выберите тест"));
    return () => unregister("test_id");
  }, [isTestType, register, unregister]);

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
    canReceivePoints,
    userTests,
  };
};

