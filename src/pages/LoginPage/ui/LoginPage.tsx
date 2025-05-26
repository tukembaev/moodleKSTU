import { LoginForm } from "features/Authorization";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "shared/hooks";

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth) {
      navigate("/main");
    }
  }, [auth]);
  return (
    <div className="flex justify-center items-center pt-32">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
