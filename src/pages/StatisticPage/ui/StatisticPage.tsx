import CourseStatistic from "entities/Course/ui/Details/OwnerDetails/CourseStatistic";

const StatisticPage = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
        Моя статистика
      </h2>
      <p className="mt-1.5 mb-4 text-lg text-muted-foreground max-w-2xl">
        Здесь вы можете просмотреть статистику по всем вашим курсам, а также
        общую статистику по всем курсам в системе.
      </p>
      <CourseStatistic />
    </div>
  );
};

export default StatisticPage;
