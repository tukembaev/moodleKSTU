import { addToCart } from "shared/functions";
import { useAuth } from "shared/hooks";
import { Button } from "shared/shadcn/ui/button";
import { Balance } from "widgets/Layout";

const GlobalCourseListByCategory = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const auth = useAuth();
  const articles = [
    {
      category: "Технологии",
      title: "10 Лучших Практик для Создания Контента",
      price: 1499.99,
      id: "article-1",
      description:
        "Learn how to create content that resonates with your audience and drives engagement for your brand.",
      date: "April 5, 2023",
      readTime: "8 min read",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      category: "Технологии",
      price: 499.99,
      title: "Современные Стратегии Социальных Медиа",
      id: "article-2",
      description:
        "Stay ahead of the curve with these cutting-edge social media strategies to boost your online presence.",
      date: "April 2, 2023",
      readTime: "10 min read",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      category: "Технологии",
      price: 299.99,
      title: "Эффективные Методы SEO для 2023 года",
      id: "article-3",
      description:
        "Discover the most effective SEO techniques to improve your website's visibility and ranking.",
      date: "March 28, 2023",
      readTime: "12 min read",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      category: "Технологии",
      price: 199.99,
      title: "Как Создать Успешный Блог",
      id: "article-4",
      description:
        "Learn the secrets to creating a successful blog that attracts readers and generates income.",
      date: "March 15, 2023",
      readTime: "15 min read",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      category: "Технологии",
      price: 99.99,
      title: "Основы Веб-Дизайна для Начинающих",
      id: "article-5",
      description:
        "A beginner's guide to web design, covering the basics of layout, color theory, and typography.",
      date: "March 1, 2023",
      readTime: "20 min read",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      category: "Технологии",
      price: 79.99,
      title: "Как Использовать Google Analytics для Анализа Данных",
      id: "article-6",
      description:
        "Learn how to use Google Analytics to track and analyze your website's performance.",
      date: "February 20, 2023",
      readTime: "25 min read",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
  ];

  return (
    <section className="container mx-auto space-y-8 px-4 py-24 md:px-6 ">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border pb-6 shadow-sm flex h-full flex-col"
          >
            <div className="relative h-[200px] overflow-hidden rounded-t-xl">
              <img
                src={article.image}
                alt={article.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="px-6 flex-grow pt-6 pb-0">
              <div className="flex gap-2 items-center">
                <Balance value={article.price} prefix="$" />
                <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ">
                  {article.category}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{article.title}</h3>
              <p className="text-muted-foreground text-sm">
                {article.description}
              </p>
            </div>
            <div className="px-6 flex items-center justify-between pt-6">
              <div className="flex gap-2">
                {auth && (
                  <Button
                    variant={"outline"}
                    onClick={() => addToCart(article)}
                  >
                    В корзину
                  </Button>
                )}

                <Button>Подробнее</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GlobalCourseListByCategory;
