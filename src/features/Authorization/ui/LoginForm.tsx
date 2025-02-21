import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "shared/ui/shadcn/button";

type FormData = {
  firstName: string;
  lastName: string;
};

const LoginForm = () => {
  const {
    register,
    // setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => console.log(data));
  const formData = watch();
  console.log(formData);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <label>First Name</label>
      <input className="border-2" {...register("firstName")} />
      <label>Last Name</label>
      <input className="border-2" {...register("lastName")} />
      <Button type="submit" variant={"default"}>
        SetValue
      </Button>
      <h1>{formData?.firstName}</h1>

      <h3>{formData?.lastName}</h3>
    </form>
  );
};
export default LoginForm;
