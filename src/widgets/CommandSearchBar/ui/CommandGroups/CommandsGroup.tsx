import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CommandGroup, CommandItem } from "shared/shadcn/ui/command";

type Command = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

const CommandsGroup = () => {
  const { t } = useTranslation();
  const availableCommands: Command[] = [
    {
      icon: <Calendar />,
      label: t("Создать курс"),
      link: "/",
    },
    {
      icon: <Calendar />,
      label: t("Создать дисциплину"),
      link: "",
    },
    {
      icon: <Calendar />,
      label: t("Создать опрос"),
      link: "",
    },
    {
      icon: <Calendar />,
      label: t("Создать тестирование"),
      link: "",
    },
  ];

  return (
    <CommandGroup heading={t("Команды")}>
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
