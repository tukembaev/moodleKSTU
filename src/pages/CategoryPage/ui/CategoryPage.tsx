import GlobalCourseListByCategory from "entities/Course/ui/GlobalCourses/GlobalCourseListByCategory";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const CategoryPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const category_type = searchParams.get("type");

  return (
    <GlobalCourseListByCategory
      title={category_type || ""}
      description={t("Каталог курсов по {{type}}", {
        type: category_type || "",
      })}
    />
  );
};

export default CategoryPage;
