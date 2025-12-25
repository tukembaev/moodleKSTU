import { CommandSeparator } from "cmdk";
import { StudyTask } from "entities/Course";
import { LuListTodo } from "react-icons/lu";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";

const StudyTasksGroup = ({ data }: { data: StudyTask[] }) => {
    if (data.length === 0) return null;

    return (
        <CommandGroup heading="Задания">
            {data.map((item) => (
                <CommandItem
                    key={item.id}
                    value={item.title}
                    className="flex flex-col items-start gap-1 py-3"
                    onSelect={() => {
                        // Navigation would require course ID, which is missing in the current structure
                        // We can add it once the API provides it or a suitable route is found
                        console.log("Selected study task:", item);
                    }}
                >
                    <div className="flex items-start gap-2">
                        <LuListTodo className="h-4 w-4 text-primary mt-1" />
                        <div className="flex flex-col">
                            <span className="font-medium leading-none">{item.title}</span>
                            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">
                                {item.discipline_name}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground whitespace-nowrap font-medium">
                            {item.type_less}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {item.result !== null ? `${item.result} / ` : ""}{item.max_points} баллов
                        </span>
                        {item.deadline && (
                            <span className="text-xs text-muted-foreground">
                                • до {new Date(item.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </CommandItem>
            ))}
            <CommandSeparator />
        </CommandGroup>
    );
};

export default StudyTasksGroup;
