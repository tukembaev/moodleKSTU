import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "shared/shadcn/ui/command";
import { searchQueries } from "../model/globalSearchAPI";
import CommandsGroup from "./CommandGroups/CommandsGroup";
import CoursesGroup from "./CommandGroups/CoursesGroup";
import EmployeesGroup from "./CommandGroups/EmployeesGroup";
import FilesGroup from "./CommandGroups/FilesGroup";
import SearchLoader from "./SearchLoader";

const CommandSearchBar = () => {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const { data, isLoading } = useQuery(searchQueries.searchResults(text));

  return (
    <Command className="rounded-lg border shadow-md md:min-w-[350px] z-50">
      <CommandInput
        value={text}
        onValueChange={(e) => setText(e)}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          setTimeout(() => setIsActive(false), 200);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsActive(false);
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder="Введите команду или поиск..."
      />
      {isActive && (
        <CommandList>
          {isLoading ? (
            <SearchLoader />
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              <CoursesGroup data={data?.courses || []} />
              <EmployeesGroup data={data?.employees || []} />
              <FilesGroup data={data?.files || []} />
              <CommandsGroup />
              {/* <CommandGroup heading="Settings">
                <CommandItem>
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup> */}
            </>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default CommandSearchBar;
