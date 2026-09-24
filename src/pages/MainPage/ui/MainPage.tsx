import { GlobalCourseCarousel } from "entities/Course";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { BrowseCourse, HighRatedCourseCarousel } from "widgets/Course";
// import UserBasket from "widgets/User/ui/UserBasket";

const MainPage = () => {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <HighRatedCourseCarousel />
      <BrowseCourse
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <div className="flex flex-col gap-2">
        <GlobalCourseCarousel
          title={t("Лучшие курсы по технике")}
          description={t("Создай порядок из того чего не бывает")}
        />
        <GlobalCourseCarousel
          title={t("Лучшие курсы по политике")}
          description={t("Создай порядок из того чего не бывает")}
        />
        <GlobalCourseCarousel
          title={t("Лучшие курсы по бизнесу")}
          description={t("Создай порядок из того чего не бывает")}
        />
        <GlobalCourseCarousel
          title={t("Лучшие курсы по психологии")}
          description={t("Создай порядок из того чего не бывает")}
        />
      </div>
    </div>
  );
};

export default MainPage;
