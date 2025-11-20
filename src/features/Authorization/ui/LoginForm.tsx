import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleIcon } from "shared/assets";
import { useAuth } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { toast } from "sonner";
import { useGoogleToken } from "../lib/useGoogleToken";
import { authUser } from "../model/services/loginAPI";
import { LoginPayload } from "../model/types/login";
import logoIQ from "/src/assets/logo.svg";

interface SignupProps {
  heading?: string;
  subheading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  signupText?: string;
  googleText?: string;
  loginText?: string;
  loginUrl?: string;
}

const LoginForm = ({
  heading = "IQ Academy",
  subheading = "Введите ваши данные",
  logo = {
    url: "https://www.shadcnblocks.com",
    src: logoIQ,
    alt: "kstuLogo",
  },
  googleText = "Войти с помощью Google",
}: SignupProps) => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<LoginPayload>();
  const [loading, setLoading] = useState(false);

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
        setTimeout(() => {
          // navigate("/main");
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

  const auth_data = useAuth();

  return (
    <section className="py-4">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col">
              <a href={logo.url}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="mb-7 h-26 w-auto mx-auto"
                />
              </a>
              <p className="mb-2 text-2xl font-bold">{heading}</p>
              {auth_data ? (
                ""
              ) : (
                <p className="text-muted-foreground">{subheading}</p>
              )}
            </div>

            <form onSubmit={onSubmit} className="grid gap-2">
              <label>Логин</label>
              <Input
                type="text"
                placeholder="Введите логин"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500">First name is required</span>
              )}
              <label>Пароль</label>
              <Input
                type="text"
                placeholder="Введите пароль"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-500">Last name is required</span>
              )}
              {loading ? (
                <div className="w-full mt-4 mb-2">Loading...</div>
              ) : (
                <Button
                  variant="default"
                  type="submit"
                  className="w-full mt-4 mb-2"
                >
                  Войти
                </Button>
              )}

              <Button
                variant="outline"
                type="button"
                onClick={authenticate}
                className="w-full"
                disabled={loadingGoogle}
              >
                <GoogleIcon />
                {googleText}
              </Button>

              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground text-center">
                <p>
                  Ваш пароль по умолчанию ваш ИНН если вы сотрудник.Если вы
                  студент s + ИНН.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
