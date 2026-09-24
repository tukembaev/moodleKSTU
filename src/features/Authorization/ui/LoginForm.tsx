import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "shared/components/LanguageSwitcher";
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
import { getPostLoginPath } from "shared/lib/navigation/hidden-ids";
import { GoogleIcon } from "shared/assets";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { FieldLabel } from "shared/components/FieldLabel";
import { onFormInvalid, requiredField } from "shared/lib/onFormInvalid";
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

const LoginForm = ({
  heading,
  subheading,
  googleText,
}: SignupProps) => {
  const { t } = useTranslation();
  const contextLabels: Record<AuthContextType, string> = {
    employee: t("Сотрудник"),
    student: t("Студент"),
  };
  const resolvedHeading = heading ?? t("Добро пожаловать");
  const resolvedSubheading =
    subheading ?? t("Войдите в свой аккаунт, чтобы продолжить");
  const resolvedGoogleText = googleText ?? t("Корпоративная почта");
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
      window.location.replace(getPostLoginPath());
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
    toast.success(t("Успешно авторизован"));
    setTimeout(() => {
      window.location.href = getPostLoginPath();
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
        error instanceof Error ? error.message : t("Неизвестная ошибка");
      toast.error(t("Ошибка авторизации: {{message}}", { message }));
      setLoading(false);
    }
  }, onFormInvalid);

  const onSelectContext = async (context: ProfileContext) => {
    setLoading(true);
    try {
      await selectAuthContext(context);
      finishLogin();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("Неизвестная ошибка");
      toast.error(t("Не удалось выбрать профиль: {{message}}", { message }));
      setLoading(false);
    }
  };

  if (restoring) {
    return (
      <div className="w-full min-h-dvh flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-dvh grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col  bg-zinc-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-xl font-bold">Unet LMS</span>
        </div> 
        <div className="relative z-10 max-w-md">
          
        <img
          src="/kstu_logo_text.png"
          alt="КГТУ им. И. Раззакова"
          className="relative z-10 w-full max-w-lg object-contain"
        />
       
          <h2 className="text-3xl font-bold mb-4">
            {t("Образовательная платформа нового поколения")}
          </h2>
          <p className="text-zinc-400 text-lg">
            {t(
              "Получайте знания, развивайте навыки и достигайте новых высот с нашей платформой."
            )}
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500 pt-10">
          © {new Date().getFullYear()} Unet LMS. {t("Все права защищены.")}
        </div>
      </div>

      <div className="relative flex min-h-dvh items-center justify-center overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:py-8 md:p-10">
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-[400px] space-y-6 sm:space-y-8">
          <div className="flex flex-col space-y-1.5 text-center sm:space-y-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{resolvedHeading}</h1>
            <p className="text-sm text-muted-foreground">{resolvedSubheading}</p>
          </div>

          {pendingContexts ? (
            <div className="grid gap-3 sm:gap-4">
              <p className="text-sm text-center text-muted-foreground">
                {t("Выберите профиль для входа")}
              </p>
              {pendingContexts.map((context) => (
                <Button
                  key={`${context.type}-${context.full_name || ""}`}
                  disabled={loading}
                  onClick={() => onSelectContext(context)}
                  className="h-auto w-full min-h-[44px] flex-col items-start gap-0.5 whitespace-normal py-3 text-left"
                  variant="outline"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <span className="font-medium">
                    {contextLabels[context.type]}
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
            <div className="grid gap-5 sm:gap-6">
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <FieldLabel htmlFor="username" required>
                      {t("ПИН")}
                    </FieldLabel>
                    <Input
                      id="username"
                      placeholder={t("ПИН")}
                      type="text"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      disabled={loading}
                      className="h-11 text-base sm:h-10 sm:text-sm"
                      {...register("username", requiredField(t("Заполните ПИН")))}
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <FieldLabel htmlFor="password" required>
                      {t("Пароль")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder={t("Введите пароль")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        disabled={loading}
                        className="h-11 pr-10 text-base sm:h-10 sm:text-sm"
                        {...register("password", requiredField(t("Заполните пароль")))}
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
                          {showPassword ? t("Скрыть пароль") : t("Показать пароль")}
                        </span>
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button disabled={loading} className="mt-2 h-11 sm:h-10">
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("Войти")}
                  </Button>
                </div>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("Или продолжить с")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  className="h-11 w-full flex-1 sm:h-10"
                  disabled={loading || loadingGoogle}
                  onClick={authenticate}
                >
                  {loadingGoogle ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="truncate">{resolvedGoogleText}</span>
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
