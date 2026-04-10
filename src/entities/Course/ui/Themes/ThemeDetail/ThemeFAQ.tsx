import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "entities/Course/model/services/courseQueryFactory";
import { useParams } from "react-router-dom";
import { FadeInList } from "shared/components";
import { FormQuery } from "shared/config";
import { useAuth, useForm } from "shared/hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { Skeleton } from "shared/shadcn/ui/skeleton";

const ThemeFAQ = ({ theme_id }: { theme_id: string }) => {
  const { id } = useParams();
  const { isStudent } = useAuth();
  const openForm = useForm();

  const { data, isLoading } = useQuery(courseQueries.allThemeFAQ(id || ""));

  return (
    <>
      {isLoading ? (
        <FadeInList>
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col border rounded-xl py-6 px-5 justify-between transition-all duration-300 lg:col-span-1"
            >
              <div className="flex justify-between">
                <Skeleton className="w-82 h-5 rounded-md " />
                <Skeleton className="w-5 h-5 rounded-md " />
              </div>
            </div>
          ))}
        </FadeInList>
      ) : (
        <Accordion type="single" className="pl-2 ">
          {data?.map(({ question, answer }, index) => (
            <AccordionItem key={question} value={`question-${index}`}>
              <AccordionTrigger className="text-left text-lg cursor-pointer">
                {question}
              </AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
          {!isStudent && (
            <AccordionItem
              value=""
              onClick={() =>
                openForm(FormQuery.ADD_THEME_FAQ, {
                  id: theme_id || "",
                })
              }
              className="text-left text-lg pt-4 font-medium cursor-pointer"
            >
              Добавить новый FAQ
            </AccordionItem>
          )}
        </Accordion>
      )}
    </>
  );
};

export default ThemeFAQ;
