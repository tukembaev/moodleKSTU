import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import $api_base_edu from "shared/api/api_base_edu";
import { API_URL } from "shared/api/config";
import { getStoredUser, hasAuthSession } from "shared/lib/auth";
import { SearchBar } from "./search";

const getGlobalSearchData = async (search: string): Promise<SearchBar> => {
  const isAuthed = hasAuthSession(getStoredUser());

  if (!isAuthed) {
    const response = await axios.get(
      `${API_URL}v1/global-search?search=${search}`,
      { withCredentials: true }
    );
    return response.data;
  }

  const response = await $api_base_edu.get(
    `v1/global-search/?search=${search}`
  );
  return response.data;
};

export const searchQueries = {
  searchResults: (searchText: string | null) =>
    queryOptions({
      queryKey: ["search", searchText],
      queryFn: () => getGlobalSearchData(searchText as string),
      enabled: !!searchText,
    }),
};
