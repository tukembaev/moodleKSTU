import { useAuth } from "shared/hooks";
import { useTranslation } from "react-i18next";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";

const StatisticPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const isStudent = auth?.isStudent ?? false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
          {t("Моя статистика")}
        </h2>
        <p className="mt-1.5 mb-4 text-lg text-muted-foreground max-w-2xl">
          {isStudent
            ? t(
                "Здесь вы можете просмотреть статистику по всем вашим курсам и общую успеваемость."
              )
            : t(
                "Здесь вы можете просмотреть статистику по всем вашим курсам, студентам и общую статистику."
              )}
        </p>
      </div>
      {isStudent ? <StudentDashboard /> : <TeacherDashboard />}
    </div>
  );
};

export default StatisticPage;
