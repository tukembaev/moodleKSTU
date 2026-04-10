import { GlobalCourseCarousel } from "entities/Course";
import { useState } from "react";

import { BrowseCourse, HighRatedCourseCarousel } from "widgets/Course";
// import UserBasket from "widgets/User/ui/UserBasket";

const MainPage = () => {
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
          title="Лучшие курсы по технике"
          description="Создай порядок из того чего не бывает"
        />
        <GlobalCourseCarousel
          title="Лучшие курсы по политике"
          description="Создай порядок из того чего не бывает"
        />
        <GlobalCourseCarousel
          title="Лучшие курсы по бизнесу"
          description="Создай порядок из того чего не бывает"
        />
        <GlobalCourseCarousel
          title="Лучшие курсы по психологии"
          description="Создай порядок из того чего не бывает"
        />
      </div>
    </div>
  );
};

export default MainPage;
