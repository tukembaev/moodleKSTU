import Add_Quiz from "features/Course/forms/add-quiz";
import { useTranslation } from "react-i18next";
import { LuListChecks } from "react-icons/lu";
import { GoogleIcon } from "shared/assets";
import { UseTabs } from "shared/components";
import Add_Test from "./add-test";

const Choose_test = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      name: t("Создать тест"),
      value: "quiz_test",
      content: <Add_Quiz />,
      icon: <LuListChecks />,
    },
    {
      name: t("Импортировать из Google"),
      value: "google_test",
      content: <Add_Test />,
      icon: <GoogleIcon />,
    },
  ];
  return <UseTabs tabs={tabs}></UseTabs>;
};

export default Choose_test;
