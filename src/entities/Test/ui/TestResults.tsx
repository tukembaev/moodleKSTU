import { useQuery } from "@tanstack/react-query";
import TestTable from "./lib/TestTable";
import { testQueries } from "../model/services/testQueryFactory";
import { useParams, useSearchParams } from "react-router-dom";

const TestResults = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const course_id = searchParams.get("course_id");
  const url = `${id}/${course_id}`;
  const { data: test_list } = useQuery(testQueries.TestResult(url as string));

  return (
    <div className="min-h-screen flex py-3 flex-col gap-4">
      <div className="w-full">
        <div className="flex flex-col">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight">
            Лучший тест
          </span>
          <p className=" text-lg text-muted-foreground pt-4">
            Максимум баллов за тест: 12
          </p>
          <p className="text-lg text-muted-foreground pt-1">
            Дедлайн сдачи: 12 апреля 2025
          </p>
        </div>
      </div>
      <TestTable data={test_list || []} />
    </div>
  );
};

export default TestResults;
