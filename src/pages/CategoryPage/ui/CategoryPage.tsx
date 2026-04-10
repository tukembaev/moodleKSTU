import GlobalCourseListByCategory from "entities/Course/ui/GlobalCourses/GlobalCourseListByCategory";
import { useSearchParams } from "react-router-dom";

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const category_type = searchParams.get("type");

  return (
    <GlobalCourseListByCategory
      title={category_type || ""}
      description={`Каталог курсов по ` + (category_type || "")}
    />
  );
};

export default CategoryPage;
