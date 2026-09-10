import Add_Quiz from "features/Course/forms/add-quiz";

const AddQuizPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-4xl font-semibold tracking-tight text-left sm:text-5xl">
          Создание теста по усвоению материала
        </h2>
        <p className="mt-1.5 text-lg text-muted-foreground">
          Создайте тест по усвоению материала для вашего курса
        </p>
      </div>
      <Add_Quiz />
    </div>
  );
};

export default AddQuizPage;

