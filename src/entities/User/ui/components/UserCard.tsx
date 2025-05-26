import UserCardSkeleton from "entities/User/lib/UserCardSkeleton";
import { userQueries } from "entities/User/model/userQueryFactory";
import { UserProfileData } from "entities/User/types/user";
import { ArrowUpRight, Flame, MapPin, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { LuPencil, LuPhone, LuSend } from "react-icons/lu";
import { PhoneInput } from "shared/components/PhoneInput";

import { useAuth } from "shared/hooks";

import { Avatar, AvatarFallback, AvatarImage } from "shared/shadcn/ui/avatar";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "shared/shadcn/ui/dialog";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { Progress } from "shared/shadcn/ui/progress";

const UserCard = ({
  data,
  isLoading,
}: {
  data: UserProfileData | undefined;
  isLoading: boolean;
}) => {
  const auth_data = useAuth();
  const [hovered, setHovered] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error] = useState<string | null>(null);
  const [numberPhone, setNumberPhone] = useState<string | undefined>(undefined);

  const { mutate: editProfile } = userQueries.edit_profile();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    telegram_username: "",
  });

  // Обновляем состояние формы при изменении `data`
  useEffect(() => {
    if (data) {
      setForm({
        bio: data.bio || "",
        telegram_username: data.telegram_username || "",
      });
      setNumberPhone(data.number_phone); // Устанавливаем номер телефона
    }
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const menuItems = [
    {
      icon: <ArrowUpRight className="w-4 h-4 text-amber-500" />,
      label: "Current Level",
      value: 42,
      desc: `${2000} / ${4000} XP`,
      progress: (2000 / 4000) * 100,
    },
    {
      icon: <Flame className="w-4 h-4 text-red-500" />,
      label: "Daily Streak",
      value: "7 days",
      desc: "🔥 Keep it up!",
    },
    {
      icon: <Shield className="w-4 h-4 text-emerald-500" />,
      label: "Achievements",
      value: "12/30",
      desc: "Master III",
    },
  ];

  if (isLoading) return <UserCardSkeleton />;
  return (
    <Card className="relative w-full p-6 rounded-4xl shadow-md flex flex-row justify-between ">
      <div className="relative flex items-center gap-16 pl-20 py-6">
        <Dialog>
          <DialogTrigger asChild>
            {data?.id === auth_data?.id ? (
              <div
                className="relative w-64 h-64 cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar className="w-64 h-64 border-4 border-white shadow-md">
                  <AvatarImage
                    src={data?.avatar}
                    alt="User avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                {hovered && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <LuPencil size={40} className="text-white" />
                  </div>
                )}
              </div>
            ) : (
              <Avatar className="w-64 h-64 border-4 border-white shadow-md">
                <AvatarImage src={data?.avatar} alt="User avatar" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Поменять аватар</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={preview || data?.avatar || "/placeholder-user.jpg"}
                    alt="Selected avatar"
                    className="object-cover"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Input id="avatar" type="file" onChange={handleFileChange} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  if (!selectedFile || !data?.id) return;
                  const formData = new FormData();
                  formData.append("avatar", selectedFile);
                  editProfile({ id: data.id, data: formData });
                }}
                disabled={!selectedFile}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div>
          <span className="text-sm font-bold text-gray-500">{data?.group}</span>
          <h2 className="text-4xl font-bold flex justify-center gap-2">
            {data?.first_name} {data?.last_name}
          </h2>
          <p className="text-gray-500">{data?.position}</p>
          <div className="mt-2 text-sm  space-y-3">
            <div className="flex items-center gap-2">
              <User size={20} /> <span>{data?.bio}</span>
            </div>
            <div className="flex items-center gap-2">
              <LuPhone size={20} />
              <a href={`tel:${data?.number_phone}`} className="hover:underline">
                {data?.number_phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={20} />
              <a href={`mailto:${data?.email}`} className="hover:underline">
                {data?.email}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <LuSend size={20} />
              <a
                href={`https://t.me/${data?.telegram_username?.replace(
                  "@",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data?.telegram_username}
              </a>
            </div>
            {auth_data?.id === data?.id && (
              <Button
                className="w-full"
                variant={"outline"}
                onClick={() => setEditOpen(true)}
              >
                Редактировать профиль
                <LuPencil />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 w-[35%] ">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 
                                border border-zinc-200/50 dark:border-zinc-800/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-lg font-semibold">{item.value}</span>
            </div>
            {item.progress ? (
              <div className="space-y-2">
                <Progress value={item.progress} className="h-2" />
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">{item.desc}</p>
            )}
          </div>
        ))}
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {["bio", "telegram_username"].map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="capitalize">
                  {field.replace("_", " ")}
                </Label>
                <Input
                  id={field}
                  value={form[field as keyof typeof form]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  className="col-span-3"
                />
              </div>
            ))}
            <div className="flex gap-2 items-center ">
              <Label htmlFor="number_phone">Номер телефона</Label>
              <PhoneInput value={numberPhone} onChange={setNumberPhone} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отмена</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setEditOpen(false);
                const formData = new FormData();
                formData.append("bio", form.bio);
                formData.append("number_phone", numberPhone || "");
                formData.append("telegram_username", form.telegram_username);

                if (data?.id) {
                  editProfile({ id: data.id, data: formData });
                }
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserCard;
