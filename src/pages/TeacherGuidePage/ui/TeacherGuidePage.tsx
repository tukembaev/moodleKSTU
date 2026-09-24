import { useMemo, useState } from "react";
import { BookOpen, Download, PlayCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import teacherGuidePdf from "../../../../docs/user-guide/Unet-LMS-rukovodstvo-prepodavatelya.pdf?url";
import AccessDenied from "shared/components/AccessDenied";
import { AppRoutes, RoutePath } from "shared/config/routeConfig/routePath";
import { useAuth } from "shared/hooks";
import { cn } from "shared/lib/utils";
import { Button } from "shared/shadcn/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";
import { buildGuideSections, GuidePart } from "../model/guideCatalog";

const TeacherGuidePage = () => {
  const auth = useAuth();
  const sections = useMemo(() => buildGuideSections(), []);
  const firstPlayable = sections
    .flatMap((section) => section.parts)
    .find((part) => part.src);
  const [selectedId, setSelectedId] = useState<string | null>(
    firstPlayable?.id ?? sections[0]?.parts[0]?.id ?? null
  );

  if (!auth.isAuthenticated) {
    return <Navigate to={RoutePath[AppRoutes.LOGIN]} replace />;
  }

  if (auth.isStudent) {
    return <AccessDenied />;
  }

  const selected =
    sections
      .flatMap((section) => section.parts)
      .find((part) => part.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Руководство
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-lg">
            Короткие видео по работе в кабинете преподавателя: курсы, темы и
            тесты.
          </p>
        </div>
        <Button variant="outline" className="shrink-0" asChild>
          <a href={teacherGuidePdf} download="Unet-LMS-rukovodstvo-prepodavatelya.pdf">
            <Download className="size-4" />
            Руководство
          </a>
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <aside className="min-h-0 overflow-y-auto rounded-xl border bg-card lg:w-[40%]">
          <Accordion
            type="multiple"
            defaultValue={sections.map((section) => section.id)}
            className="px-4"
          >
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="text-base hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <ul className="flex flex-col gap-1">
                    {section.parts.map((part) => (
                      <li key={part.id}>
                        <PartButton
                          part={part}
                          active={part.id === selected?.id}
                          onSelect={() => setSelectedId(part.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </aside>

        <section className="flex min-h-[280px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[60%] lg:flex-none">
          <Player part={selected} />
        </section>
      </div>
    </div>
  );
};

function PartButton({
  part,
  active,
  onSelect,
}: {
  part: GuidePart;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-accent/50"
      )}
    >
      <PlayCircle
        className={cn(
          "size-4 shrink-0",
          part.src ? "text-foreground" : "text-muted-foreground"
        )}
      />
      <span className="min-w-0 flex-1">{part.title}</span>
      {!part.src && (
        <span className="shrink-0 text-xs text-muted-foreground">скоро</span>
      )}
    </button>
  );
}

function Player({ part }: { part: GuidePart | null }) {
  if (!part) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
        <BookOpen className="size-8" />
        <p>Выберите часть слева, чтобы открыть видео.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b px-4 py-3">
        <p className="text-sm font-medium">{part.title}</p>
      </div>
      {part.src ? (
        <div className="flex min-h-0 flex-1 items-center bg-black">
          <video
            key={part.src}
            className="max-h-full w-full"
            src={part.src}
            controls
            playsInline
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
          <PlayCircle className="size-8" />
          <p>Видео для этой части ещё не добавлено.</p>
        </div>
      )}
    </div>
  );
}

export default TeacherGuidePage;
