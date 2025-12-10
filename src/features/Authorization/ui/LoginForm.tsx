import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleIcon } from "shared/assets";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";
import { toast } from "sonner";
import { useGoogleToken } from "../lib/useGoogleToken";
import { authUser } from "../model/services/loginAPI";
import { LoginPayload } from "../model/types/login";
import logoIQ from "/src/assets/logo.svg";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface SignupProps {
  heading?: string;
  subheading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  googleText?: string;
}

const LoginForm = ({
  heading = "Добро пожаловать",
  subheading = "Войдите в свой аккаунт, чтобы продолжить",
  logo = {
    url: "/",
    src: logoIQ,
    alt: "Logo",
  },
  googleText = "Войти через Google",
}: SignupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loading: loadingGoogle, authenticate } = useGoogleToken();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await authUser(data);

      if (response) {
        toast.success("Успешно авторизован");

        localStorage.setItem(
          "auth_data",
          JSON.stringify({
            ...response,
            isStudent: response.position === null,
          })
        );

        window.dispatchEvent(new Event("storage"));
        // Use window.location for hard redirect to ensure state clean up
        setTimeout(() => {
          window.location.href = "/courses";
        }, 100);
      }
    } catch (error: any) {
      toast.error(
        `Ошибка авторизации: ${error?.message || "Неизвестная ошибка"}`
      );
      setLoading(false);
    }
  });

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        {/* Decorative elements could go here */}
        <div className="relative z-10 flex items-center gap-2">
           <img
              src={logo.src}
              alt={logo.alt}
              className="h-10 w-auto invert brightness-0" 
            />
           <span className="text-xl font-bold">IQ Academy</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Образовательная платформа нового поколения
          </h2>
          <p className="text-zinc-400 text-lg">
            Получайте знания, развивайте навыки и достигайте новых высот с нашей платформой.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} IQ Academy. Все права защищены.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col space-y-2 text-center">
             {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-4">
               <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-12 w-auto"
                />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {heading}
            </h1>
            <p className="text-sm text-muted-foreground">
              {subheading}
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Логин</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="text" // Assuming login is text/email
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={loading}
                    {...register("email", { 
                      required: "Логин обязателен" 
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
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
                        required: "Пароль обязателен" 
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

            <Button
              variant="outline"
              type="button"
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
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Ваш пароль по умолчанию ваш ИНН если вы сотрудник. Если вы студент s + ИНН.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
