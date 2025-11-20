import Add_Quiz from "features/Course/forms/add-quiz";
import { LuListChecks } from "react-icons/lu";
import { GoogleIcon } from "shared/assets";
import { UseTabs } from "shared/components";
import Add_Test from "./add-test";

const Choose_test = () => {
  const tabs = [
    {
      name: "Создать тест",
      value: "quiz_test",
      content: <Add_Quiz />,
      icon: <LuListChecks />,
    },
    {
      name: "Импортировать из Google",
      value: "google_test",
      content: <Add_Test />,
      icon: <GoogleIcon />,
    },
  ];
  return <UseTabs tabs={tabs}></UseTabs>;
};

export default Choose_test;
