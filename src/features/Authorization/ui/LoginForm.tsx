import { useEffect, useState } from "react";
import {
  AuthContextType,
  getActiveContext,
  getAvailableProfileContexts,
  getStoredUser,
  hasAuthSession,
  ProfileContext,
  selectAuthContext,
  authByPassword,
} from "shared/lib/auth";
import { GoogleIcon } from "shared/assets";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useGoogleToken } from "../lib/useGoogleToken";
import { LoginPayload } from "../model/types/login";
import { Loader2, Eye, EyeOff, BookOpen } from "lucide-react";
import teacherGuidePdf from "../../../../docs/user-guide/Unet-LMS-rukovodstvo-prepodavatelya.pdf?url";

interface SignupProps {
  heading?: string;
  subheading?: string;
  googleText?: string;
}

const CONTEXT_LABELS: Record<AuthContextType, string> = {
  employee: "Сотрудник",
  student: "Студент",
};

const LoginForm = ({
  heading = "Добро пожаловать",
  subheading = "Войдите в свой аккаунт, чтобы продолжить",
  googleText = "Корпоративная почта",
}: SignupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingContexts, setPendingContexts] = useState<ProfileContext[] | null>(
    null
  );

  const { loading: loadingGoogle, authenticate } = useGoogleToken();

  useEffect(() => {
    if (hasAuthSession() && getActiveContext()) {
      window.location.replace("/courses");
      return;
    }

    const onNeedsContext = (event: Event) => {
      const detail = (event as CustomEvent<ProfileContext[]>).detail;
      setPendingContexts(
        detail?.length
          ? detail
          : [
              { type: "employee" },
              { type: "student" },
            ]
      );
      setRestoring(false);
    };

    if (getStoredUser() && !getActiveContext()) {
      const contexts = getAvailableProfileContexts();
      if (contexts.length) {
        setPendingContexts(contexts);
      }
    }

    setRestoring(false);
    window.addEventListener("auth:needs-context", onNeedsContext);
    return () => {
      window.removeEventListener("auth:needs-context", onNeedsContext);
    };
  }, []);

  const finishLogin = () => {
    toast.success("Успешно авторизован");
    setTimeout(() => {
      window.location.href = "/courses";
    }, 100);
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const result = await authByPassword(data);

      if (result.requiresContextSelection) {
        setPendingContexts(
          result.availableContexts.length
            ? result.availableContexts
            : [{ type: "employee" }, { type: "student" }]
        );
        setLoading(false);
        return;
      }

      finishLogin();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      toast.error(`Ошибка авторизации: ${message}`);
      setLoading(false);
    }
  });

  const onSelectContext = async (context: ProfileContext) => {
    setLoading(true);
    try {
      await selectAuthContext(context);
      finishLogin();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Неизвестная ошибка";
      toast.error(`Не удалось выбрать профиль: ${message}`);
      setLoading(false);
    }
  };

  if (restoring) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-xl font-bold">Unet LMS</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Образовательная платформа нового поколения
          </h2>
          <p className="text-zinc-400 text-lg">
            Получайте знания, развивайте навыки и достигайте новых высот с нашей
            платформой.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} Unet LMS. Все права защищены.
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
            <p className="text-sm text-muted-foreground">{subheading}</p>
          </div>

          {pendingContexts ? (
            <div className="grid gap-4">
              <p className="text-sm text-center text-muted-foreground">
                Выберите профиль для входа
              </p>
              {pendingContexts.map((context) => (
                <Button
                  key={`${context.type}-${context.full_name || ""}`}
                  disabled={loading}
                  onClick={() => onSelectContext(context)}
                  className="w-full h-auto py-3 flex flex-col items-start gap-0.5"
                  variant="outline"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <span className="font-medium">
                    {CONTEXT_LABELS[context.type]}
                    {context.position ? ` · ${context.position}` : ""}
                  </span>
                  {context.full_name && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {context.full_name}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">ПИН</Label>
                    <Input
                      id="username"
                      placeholder="ПИН"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      disabled={loading}
                      {...register("username", {
                        required: "ПИН обязателен",
                      })}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder="Введите пароль"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={loading}
                        className="pr-10"
                        {...register("password", {
                          required: "Пароль обязателен",
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Скрыть пароль" : "Показать пароль"}
                        </span>
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button disabled={loading} className="mt-2">
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Войти
                  </Button>
                </div>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Или продолжить с
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  disabled={loading || loadingGoogle}
                  onClick={authenticate}
                >
                  {loadingGoogle ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  {googleText}
                </Button>
                <Button variant="outline" type="button" className="flex-1" asChild>
                  <a
                    href={teacherGuidePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="h-4 w-4" />
                    Руководство
                  </a>
                </Button>
              </div>
            </div>
          )}

        
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
