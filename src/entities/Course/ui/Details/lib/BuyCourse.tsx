import { FC } from "react";
import { CircleCheck } from "lucide-react";
import { LuFolderPlus, LuHandshake } from "react-icons/lu";
import { addToCart } from "shared/functions";
import { Button } from "shared/shadcn/ui/button";
import { useAuth } from "shared/hooks";

const course_info = {
  id: "1",
  title: "Курс #1",
  category: "Технологии",
  name: "Advanced",
  price: 29,
  isRecommended: true,
  description:
    "Get 50 AI-generated portraits with 5 unique styles and filters.",
  features: [
    "3 hours turnaround time",
    "50 AI portraits",
    "Choice of 5 styles",
    "Choice of 5 filters",
    "5 retouch credits",
  ],
  buttonText: "Get 50 portraits in 3 hours",
  isPopular: true,
};

export const BuyCourse: FC = () => {
  const auth = useAuth();
  return (
    <div className="border rounded-lg p-6 flex justify-between">
      <ul className="space-y-2 max-w-md">
        <h1 className="text-3xl">{course_info.description}</h1>
        <h2 className="font-semibold">Что вы получите</h2>
        {course_info.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
            {feature}
          </li>
        ))}
      </ul>
      {auth && (
        <div className="flex flex-col bg-foreground/20 py-6 px-12 rounded-lg">
          <p className="mt-2 text-4xl font-bold mx-auto">
            ${course_info.price}
          </p>
          <Button
            variant={course_info.isPopular ? "default" : "outline"}
            size="lg"
            className="w-full mt-6"
            onClick={() => addToCart(course_info)}
          >
            Добавить в корзину <LuFolderPlus />
          </Button>
          <Button variant="outline" size="lg" className="w-full mt-2">
            Купить сейчас <LuHandshake />
          </Button>
        </div>
      )}
    </div>
  );
};
