import { useAuth } from "shared/hooks";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";

const StatisticPage = () => {
  const auth = useAuth();
  const isStudent = auth?.isStudent ?? false;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
          Моя статистика
        </h2>
        <p className="mt-1.5 mb-4 text-lg text-muted-foreground max-w-2xl">
          {isStudent
            ? "Здесь вы можете просмотреть статистику по всем вашим курсам и общую успеваемость."
            : "Здесь вы можете просмотреть статистику по всем вашим курсам, студентам и общую статистику."}
        </p>
      </div>
      {isStudent ? <StudentDashboard /> : <TeacherDashboard />}
    </div>
  );
};

export default StatisticPage;
