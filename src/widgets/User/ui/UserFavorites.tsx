import { useQuery } from "@tanstack/react-query";
import { FavoriteCourses, FavoriteThemes } from "entities/Course";
import { userQueries } from "entities/User";
import { LuComponent, LuLayoutGrid } from "react-icons/lu";
import { UseTabs } from "shared/components";
import { Separator } from "shared/shadcn/ui/separator";

const UserFavorites = () => {
  const { data: favorites, isLoading } = useQuery(userQueries.user_favorites());

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-4xl sm:text-4xl font-semibold tracking-tight text-left italic ">
        Избранное
      </h2>

      {favorites?.courses.length || favorites?.themes.length ? (
        <div>
          <UseTabs
            classNames="mt-4"
            tabs={[
              {
                name: "Курсы",
                value: "courses",
                content: (
                  <FavoriteCourses
                    isLoading={isLoading}
                    data={favorites?.courses || []}
                  />
                ),
                count: favorites?.courses?.length || 0,
                icon: <LuLayoutGrid />,
              },
              {
                name: "Темы",
                value: "themes",
                content: (
                  <FavoriteThemes
                    isLoading={isLoading}
                    data={favorites?.themes || []}
                  />
                ),
                count: favorites?.themes?.length || 0,
                icon: <LuComponent />,
              },
            ]}
          />
          <Separator className="my-6" />
        </div>
      ) : (
        "У вас нет избранных курсов или тем"
      )}
    </div>
  );
};

export default UserFavorites;
