import { useSearchParams, useNavigate } from "react-router-dom";
import { FormQuery } from "shared/config";
import {
  clearFormHiddenParams,
  getFormHiddenParam,
  isUuid,
  setFormHiddenParams,
} from "shared/lib/navigation/hidden-ids";

const useForm = () => {
  const navigate = useNavigate();

  const navigateToForm = (
    form: FormQuery,
    params: Record<string, string> = {}
  ) => {
    const searchParams = new URLSearchParams({ form });
    const hidden: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (!value) return;
      if (isUuid(value)) {
        hidden[key] = value;
        return;
      }
      searchParams.append(key, value);
    });

    if (Object.keys(hidden).length) {
      setFormHiddenParams(hidden);
    }

    navigate(`?${searchParams.toString()}`);
  };

  return navigateToForm;
};

export function useFormParam(key: string): string | null {
  const [searchParams] = useSearchParams();
  return searchParams.get(key) || getFormHiddenParam(key);
}

export function closeFormSearch(search: URLSearchParams) {
  clearFormHiddenParams();
  search.delete("form");
}

export default useForm;
