import { useNavigate } from "react-router-dom";
import { FormQuery } from "shared/config";

// Кастомный хук для навигации по формам
const useForm = () => {
  const navigate = useNavigate();

  const navigateToForm = (
    form: FormQuery,
    params: Record<string, string> = {}
  ) => {
    const searchParams = new URLSearchParams({ form });

    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    navigate(`?${searchParams.toString()}`);
  };

  return navigateToForm;
};

export default useForm;
