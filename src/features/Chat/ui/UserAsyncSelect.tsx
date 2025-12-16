// UserAsyncSelect.tsx - компонент для выбора одного пользователя

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "shared/shadcn/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/shadcn/ui/popover";
import { cn } from "shared/lib/utils";
import { getChatUsers } from "../model/services/chatAPI";
import type { ChatUser } from "../model/types/chat";

interface UserAsyncSelectProps {
  value: number | null;
  onChange: (userId: number | null) => void;
  placeholder?: string;
  className?: string;
}

export function UserAsyncSelect({
  value,
  onChange,
  placeholder = "Выберите пользователя",
  className,
}: UserAsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open && users.length === 0) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getChatUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find((user) => user.id === value);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          isAnimated={false}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback>
                  {selectedUser.first_name[0]}
                  {selectedUser.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <span>
                {selectedUser.first_name} {selectedUser.last_name}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Поиск пользователя..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>Пользователи не найдены</CommandEmpty>
                <CommandGroup>
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id.toString()}
                      onSelect={() => {
                        onChange(user.id === value ? null : user.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        {user.position && (
                          <span className="text-xs text-muted-foreground">
                            {user.position}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


