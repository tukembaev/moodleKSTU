import { TestEditorPanel } from "entities/Course/ui/Themes2/TestEditorPanel";
import { useNavigate } from "react-router-dom";
import { useQuizId } from "shared/lib/navigation/hidden-ids";

const EditQuizPage = () => {
  const id = useQuizId();
  const navigate = useNavigate();

  if (!id) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-left">
          Редактирование теста
        </h2>
        <p className="mt-1.5 text-lg text-muted-foreground">
          Измените вопросы, баллы и настройки теста
        </p>
      </div>
      <div className="h-[calc(100dvh-12rem)] min-h-[32rem]">
        <TestEditorPanel
          testId={id}
          onDeleted={() => navigate("/test")}
        />
      </div>
    </div>
  );
};

export default EditQuizPage;
