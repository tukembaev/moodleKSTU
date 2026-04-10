import {
  BadgeDollarSign,
  Bike,
  BookHeart,
  BriefcaseBusiness,
  Cpu,
  FlaskRound,
  HeartPulse,
  Scale,
} from "lucide-react";
import { LuSearch } from "react-icons/lu";
import { Button } from "shared/shadcn/ui/button";
import { Input } from "shared/shadcn/ui/input";
import { Label } from "shared/shadcn/ui/label";

const categories = [
  {
    name: "Technology",
    totalPosts: 10,
    icon: Cpu,
    background: "bg-indigo-200",
    color: "text-indigo-500",
  },
  {
    name: "Business",
    totalPosts: 5,
    icon: BriefcaseBusiness,
    background: "bg-amber-200",
    color: "text-amber-500",
  },
  {
    name: "Finance",
    totalPosts: 8,
    icon: BadgeDollarSign,
    background: "bg-emerald-200",
    color: "text-emerald-500",
  },
  {
    name: "Health",
    totalPosts: 12,
    icon: HeartPulse,
    background: "bg-rose-300",
    color: "text-rose-500",
  },
  {
    name: "Lifestyle",
    totalPosts: 15,
    icon: BookHeart,
    background: "bg-cyan-200",
    color: "text-cyan-500",
  },
  {
    name: "Politics",
    totalPosts: 20,
    icon: Scale,
    background: "bg-teal-200",
    color: "text-teal-500",
  },
  {
    name: "Science",
    totalPosts: 25,
    icon: FlaskRound,
    background: "bg-purple-200",
    color: "text-purple-500",
  },
  {
    name: "Sports",
    totalPosts: 30,
    icon: Bike,
    background: "bg-cyan-200",
    color: "text-cyan-500",
  },
];

interface BrowseCourseProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function BrowseCourse({
  selectedCategories,
  setSelectedCategories,
}: BrowseCourseProps) {
  const toggleCategory = (categoryName: string): void => {
    setSelectedCategories((prev: string[]) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <span className="text-cyan-500">Откройте </span>для себя
              <br />
              новые
              <span className="text-orange-500"> знания</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-xl">
              Открывай для себя актуальные знания от преподавателей и экспертов
            </p>

            <div className="relative mx-auto mt-7 max-w-xl sm:mt-12">
              <div className="absolute end-0 top-0 hidden translate-x-20 -translate-y-12 md:block">
                <svg
                  className="h-auto w-16 text-orange-500"
                  width={121}
                  height={135}
                  viewBox="0 0 121 135"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <path
                    d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                  <path
                    d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                    stroke="currentColor"
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* End SVG Element */}
              {/* SVG Element */}
              <div className="absolute start-0 bottom-0 hidden -translate-x-32 translate-y-10 md:block">
                <svg
                  className="h-auto w-40 text-cyan-500"
                  width={347}
                  height={188}
                  viewBox="0 0 347 188"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                    stroke="currentColor"
                    strokeWidth={7}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <form>
                <div className="relative z-10 flex space-x-3">
                  <div className="flex-[1_0_0%]">
                    <Label htmlFor="article" className="sr-only">
                      Поиск по курсам
                    </Label>
                    <Input
                      name="article"
                      className="h-full"
                      id="article"
                      placeholder=" Поиск по курсам"
                    />
                  </div>
                  <div className="flex-[0_0_auto]">
                    <Button size={"icon"} variant={"outline"}>
                      <LuSearch />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2 ">
              {categories.map((category) => {
                const isActive = selectedCategories.includes(category.name);
                return (
                  <Button
                    key={category.name}
                    variant={"outline"}
                    className={`flex items-center gap-2  ${
                      isActive
                        ? `${category.background} hover:${category.background} `
                        : "bg-white"
                    }`}
                    onClick={() => toggleCategory(category.name)}
                  >
                    {category.icon && (
                      <category.icon
                        className={`mr-2 h-auto w-3 flex-shrink-0 ${
                          isActive
                            ? `${category.color} hover:${category.color} `
                            : "text-gray-500"
                        }`}
                      />
                    )}
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
