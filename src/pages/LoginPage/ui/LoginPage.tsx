import { LoginForm } from "features/Authorization";

const LoginPage = () => {
  // useEffect(() => {
  //   if (auth) {
  //     navigate("/courses");
  //   }
  // }, [auth]);
  return (
    <div className="flex justify-center items-center pt-32">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
