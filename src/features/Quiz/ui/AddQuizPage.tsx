import Add_Quiz from "features/Course/forms/add-quiz";

const AddQuizPage = () => {
  return (
    <div className="container mx-auto py-2">
       <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
            Создание теста по усвоению материала
          </h2>
          <p className="mt-1.5 text-lg text-muted-foreground pb-6">
            Создайте тест по усвоению материала для вашего курса
          </p>
      <Add_Quiz chooseCourse={true}/>
    </div>
  );
};

export default AddQuizPage;

