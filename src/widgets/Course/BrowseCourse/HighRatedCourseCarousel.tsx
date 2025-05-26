import { Button } from "shared/shadcn/ui/button";
import { Badge } from "shared/shadcn/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { addToCart } from "shared/functions";
import { LuStar } from "react-icons/lu";
import { useAuth } from "shared/hooks";

// interface Category {
//   title: string;
//   description: string;
//   image: string;
//   productCount: number;
//   featured?: boolean;
//   rating: number;
//   reviewCount: number;
//   price: string;
//   tags: string[];
// }

export default function HighRatedCourseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const auth = useAuth();
  const categories = [
    {
      id: "1",
      title: "Веб-разработка",
      category: "Технологии",
      description:
        "Освойте веб-технологии и фреймворки для создания адаптивных и динамичных веб-сайтов.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      courseCount: 42,
      featured: true,
      rating: 4.8,
      reviewCount: 2300,
      price: 10,
      tags: ["Программирование", "Frontend", "Backend", "Fullstack"],
    },
    {
      id: "2",
      category: "Стиль жизни",

      title: "Креативное письмо",
      description:
        "Повышайте свои навыки письма и создавайте увлекательные истории, статьи или контент.",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      courseCount: 22,
      rating: 4.5,
      reviewCount: 1500,
      price: 23,
      tags: ["Литература", "Контент", "Креативность", "Навыки письма"],
    },
    {
      id: "3",
      category: "Финансы",

      title: "Управление бизнесом",
      description:
        "Развивайте навыки лидерства, стратегии и предпринимательства для роста вашего бизнеса.",
      image:
        "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      courseCount: 28,
      rating: 4.6,
      reviewCount: 1200,
      price: 25,
      tags: ["Лидерство", "Стратегия", "Финансы", "Предпринимательство"],
    },
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    timeoutRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl pb-8 flex gap-6">
      {/* Text Content */}
      <div className="w-1/3 space-y-6 p-4">
        {categories[currentIndex].featured && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary mb-4"
          >
            Featured Collection
          </Badge>
        )}
        <h2 className="text-4xl font-semibold tracking-tight">
          {categories[currentIndex].title}
        </h2>
        <p className="text-accent-foreground/80 text-lg">
          {categories[currentIndex].description}
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <LuStar
                key={i}
                className={`h-5 w-5 text-yellow-400 fill-yellow-400`}
              />
            ))}
            <span className="ml-2 font-medium">
              {categories[currentIndex].rating}
            </span>
            <span className="text-accent-foreground/80">
              ({categories[currentIndex].reviewCount})
            </span>
          </div>
          <div className="text-accent-foreground/80">
            {categories[currentIndex].courseCount} products
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories[currentIndex].tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-background/50 backdrop-blur-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-4 justify-end">
          {auth && (
            <Button
              variant="outline"
              onClick={() => {
                addToCart({
                  id: categories[currentIndex].id,
                  title: categories[currentIndex].title,
                  price: categories[currentIndex].price,
                  category: categories[currentIndex].category,
                });
              }}
            >
              В корзину
            </Button>
          )}

          <Button>Подробнее</Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-2/3 bg-card relative overflow-hidden rounded-xl border max-h-[400px] min-h-[400px]">
        <div className="relative aspect-[21/9] h-full">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className={`absolute inset-0 transition-transform duration-500 ease-out ${
                index === currentIndex
                  ? "translate-x-0"
                  : index < currentIndex
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
            >
              <img
                src={category.image}
                alt={category.title}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 500);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
