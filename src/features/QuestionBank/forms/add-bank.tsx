import { questionBankQueries, type CreateBankPayload } from "entities/QuestionBank";
import { useForm } from "react-hook-form";
import { LuCloudUpload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { openBank } from "shared/lib/navigation/hidden-ids";
import { Button } from "shared/shadcn/ui/button";
import { Card } from "shared/shadcn/ui/card";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { Textarea } from "shared/shadcn/ui/textarea";

const Add_Bank = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBankPayload>({
    defaultValues: { name: "", description: "" },
  });
  const { mutate: createBank, isPending } = questionBankQueries.create_bank();

  const onSubmit = (data: CreateBankPayload) => {
    createBank(
      {
        name: data.name.trim(),
        description: data.description?.trim() ?? "",
      },
      {
        onSuccess: (bank) => {
          openBank(navigate, bank.id);
        },
      }
    );
  };

  return (
    <section className="py-4">
      <Card className="flex flex-col gap-4 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="bank-name" className="pb-2">
              Название
            </Label>
            <Input
              id="bank-name"
              placeholder="Программирование"
              {...register("name", { required: true, minLength: 2 })}
            />
            {errors.name && (
              <span className="text-xs text-red-500 pt-1">
                Укажите название коллекции
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bank-description" className="pb-2">
              Описание
            </Label>
            <Textarea
              id="bank-description"
              placeholder="Вопросы по основам языка и алгоритмам"
              {...register("description")}
            />
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              <LuCloudUpload />
              {isPending ? "Создание..." : "Создать коллекцию"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default Add_Bank;
