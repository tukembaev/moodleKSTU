import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { FadeInList, SpringPopupList } from "shared/components";
import { cn } from "shared/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { universityQueries } from "../model/services/universityQueryFactory";

const UniversityList = () => {
  // const [idDepartment, setIdDepartment] = useState<number | null>(null);
  const { data, isLoading, error } = useQuery(universityQueries.allCourses());

  // const {
  //   data: professors,
  //   isLoading: isLoadingProf,
  //   error: errorProf,
  // } = useQuery(universityQueries.getProfessors(idDepartment));

  if (error) return <div>{error.message}</div>;

  return (
    <div className="w-full ">
      <h2 className="text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight">
        Все университеты
      </h2>
      <p className="mt-1.5 text-lg text-muted-foreground">
        Список всех университетов, их кафедр и преподавателей.
      </p>
      <Accordion
        type="single"
        collapsible
        className="mt-8 max-w-4xl space-y-4"
        defaultValue="question-0"
      >
        {isLoading ? (
          <FadeInList>
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col border rounded-xl py-6 px-5 justify-between transition-all duration-300 lg:col-span-1 mb-4"
              >
                <div className="flex justify-between">
                  <Skeleton className="w-82 h-5 rounded-md " />
                  <Skeleton className="w-5 h-5 rounded-md " />
                </div>
              </div>
            ))}
          </FadeInList>
        ) : (
          <SpringPopupList>
            {data?.map((institute, instituteIndex) => (
              <AccordionItem
                key={instituteIndex}
                value={`institute-${instituteIndex}`}
                className="bg-accent py-1 px-4 rounded-xl border-none"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                      "text-start text-lg"
                    )}
                  >
                    {institute.title_faculty}
                    <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    {institute.department.map((department, departmentIndex) => (
                      <AccordionItem
                        key={departmentIndex}
                        value={`department-${instituteIndex}-${departmentIndex}`}
                      >
                        <AccordionTrigger
                          // onClick={() => setIdDepartment(department.id)}
                          className="pl-4"
                        >
                          {department.departament_name}
                        </AccordionTrigger>

                        <AccordionContent className="pl-10">
                          {/* {isLoadingProf && <div>Loading...</div>} */}
                          {/* {errorProf && <div>{errorProf.message}</div>} */}
                          {/* <UserList
                            users={professors || []}
                            isLoading={isLoadingProf}
                          /> */}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </SpringPopupList>
        )}
      </Accordion>
    </div>
  );
};

export default UniversityList;
