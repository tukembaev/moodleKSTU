import Add_Quiz from "features/Course/forms/add-quiz";
import { useTranslation } from "react-i18next";

const AddQuizPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-4xl font-semibold tracking-tight text-left sm:text-5xl">
          {t("Создание теста по усвоению материала")}
        </h2>
        <p className="mt-1.5 text-lg text-muted-foreground">
          {t("Создайте тест по усвоению материала для вашего курса")}
        </p>
      </div>
      <Add_Quiz />
    </div>
  );
};

export default AddQuizPage;

