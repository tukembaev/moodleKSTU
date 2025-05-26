import { Calendar } from "lucide-react";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";

type Command = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

const availableCommands: Command[] = [
  {
    icon: <Calendar />,
    label: "Создать курс",
    link: "/",
  },
  {
    icon: <Calendar />,
    label: "Создать дисциплину",
    link: "",
  },
  {
    icon: <Calendar />,
    label: "Создать опрос",
    link: "",
  },
  {
    icon: <Calendar />,
    label: "Создать тестирование",
    link: "",
  },
];

const CommandsGroup = () => {
  return (
    <CommandGroup heading="Команды">
      {availableCommands.map((command) => (
        <CommandItem key={command.label} value={command.label}>
          {command.icon}
          <span>{command.label}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default CommandsGroup;
