import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronRight, Trash2 } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  FadeInList,
  SpringPopupList,
  UseConfirmationDialog,
  UseTooltip,
} from "shared/components";
import { FormQuery } from "shared/config";
import { useForm } from "shared/hooks";
import { openBank } from "shared/lib/navigation/hidden-ids";
import { Badge } from "shared/shadcn/ui/badge";
import { Button } from "shared/shadcn/ui/button";
import { Card, CardContent } from "shared/shadcn/ui/card";
import { Skeleton } from "shared/shadcn/ui/skeleton";
import { questionBankQueries } from "../model/services/questionBankQueryFactory";
import { bankQuestionsCount } from "../model/types/questionBank";

const BankCardSkeleton = () => (
  <div className="flex min-w-1/3 flex-col justify-between rounded-xl border px-5 py-6">
    <Skeleton className="h-6 w-3/4 rounded-md" />
    <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
    <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
    <Skeleton className="mt-6 h-10 w-24 rounded-md" />
  </div>
);

const BankList = () => {
  const navigate = useNavigate();
  const openForm = useForm();
  const { data, isLoading, error } = useQuery(questionBankQueries.allBanks());
  const { mutate: removeBank, isPending: isDeleting } =
    questionBankQueries.delete_bank();

  return (
    <div className="flex min-h-screen py-3">
      <div className="w-full">
        <div className="mx-auto mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <SpringPopupList>
              {Array.from({ length: 3 }).map((_, index) => (
                <BankCardSkeleton key={index} />
              ))}
            </SpringPopupList>
          ) : error ? (
            <p>Произошла непредвиденная ошибка! {error.message}</p>
          ) : (
            <FadeInList>
              {data?.map((bank) => {
                const count = bankQuestionsCount(bank);
                const createdAt = bank.createdAt ? new Date(bank.createdAt) : null;
                return (
                  <Card key={bank.id} className="transition-all duration-300">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <span className="text-lg font-semibold">{bank.name}</span>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">
                          {count} {count === 1 ? "вопрос" : "вопросов"}
                        </Badge>
                        {createdAt && !Number.isNaN(createdAt.getTime()) && (
                          <span>
                            {format(createdAt, "d MMMM yyyy", { locale: ru })}
                          </span>
                        )}
                      </div>
                      <span className="line-clamp-2 text-md text-foreground/80">
                        {bank.description || "Без описания"}
                      </span>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <Button
                          className="h-8 w-full text-sm shadow-none sm:flex-1"
                          variant="outline"
                          onClick={() => openBank(navigate, bank.id)}
                        >
                          Открыть
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <UseConfirmationDialog
                          title="Удалить Коллекция?"
                          description={`«${bank.name}» будет удалён вместе со всеми вопросами.`}
                          onConfirm={() => removeBank(bank.id)}
                          trigger={
                            <Button
                              className="h-8 w-full text-sm shadow-none sm:flex-1"
                              variant="destructive"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                              Удалить
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <div
                className="group flex min-h-48 min-w-1/3 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-4 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => openForm(FormQuery.ADD_BANK)}
              >
                <UseTooltip text="Создать Коллекция вопросов">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <LuPlus size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-foreground transition-colors group-hover:text-primary">
                        Добавить Коллекцию
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Нажмите, чтобы добавить коллекцию вопросов
                      </p>
                    </div>
                  </div>
                </UseTooltip>
              </div>
            </FadeInList>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankList;
