import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/shadcn/ui/button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            Что-то пошло не так...
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Страница, которую вы ищете, не существует.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="inline-flex focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4 cursor-pointer"
          >
            Вернуться назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(NotFoundPage);
