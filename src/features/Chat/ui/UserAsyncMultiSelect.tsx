// UserAsyncMultiSelect.tsx - компонент для выбора нескольких пользователей

import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Badge } from "shared/shadcn/ui/badge";
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

interface UserAsyncMultiSelectProps {
  value: number[];
  onChange: (userIds: number[]) => void;
  placeholder?: string;
  className?: string;
}

export function UserAsyncMultiSelect({
  value,
  onChange,
  placeholder = "Выберите участников",
  className,
}: UserAsyncMultiSelectProps) {
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

  const selectedUsers = users.filter((user) => value.includes(user.id));

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const toggleUser = (userId: number) => {
    if (value.includes(userId)) {
      onChange(value.filter((id) => id !== userId));
    } else {
      onChange([...value, userId]);
    }
  };

  const removeUser = (userId: number) => {
    onChange(value.filter((id) => id !== userId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-start min-h-10 h-auto", className)}
          isAnimated={false}
        >
          <div className="flex flex-wrap gap-1 w-full">
            {selectedUsers.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedUsers.map((user) => (
                <Badge
                  key={user.id}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-[8px]">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">
                    {user.first_name} {user.last_name}
                  </span>
                  <button
                    type="button"
                    className="ml-1 rounded-full hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeUser(user.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
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
                      onSelect={() => toggleUser(user.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(user.id)
                            ? "opacity-100"
                            : "opacity-0"
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





