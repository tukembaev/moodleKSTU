import { useMutation, useQuery } from "@tanstack/react-query";
import { swapiQueries } from "features/Authorization/model/services/loginQueryFactory";
import { queryClient } from "shared/api/queryClient";

import { Button } from "shared/ui/shadcn/button";

const MainPage = () => {
  const { data, isLoading, error } = useQuery(swapiQueries.allPeople());
  const mutation = useMutation({
    mutationFn: swapiQueries.createPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: swapiQueries.all() });
    },
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  console.log(data);
  return (
    <div className="text-4xl">
      <h1>{data[0].name}</h1>
      <Button
        variant={"outline"}
        onClick={() =>
          mutation.mutate({
            name: "Test",
            birth_year: "Unknown",
            gender: "n/a",
          })
        }
      >
        Button
      </Button>
    </div>
  );
};

export default MainPage;
