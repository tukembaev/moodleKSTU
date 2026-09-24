export type GuidePart = {
  id: string;
  title: string;
  src: string | null;
};

export type GuideSection = {
  id: string;
  title: string;
  parts: GuidePart[];
};

type PlannedPart = {
  file: string;
  title: string;
};

type PlannedSection = {
  folder: string;
  title: string;
  parts: PlannedPart[];
};

/**
 * Ожидаемые ролики. Файл с тем же именем в папке раздела подставится сам.
 * Лишние файлы в `videos/` тоже появятся в списке.
 */
const PLANNED_SECTIONS: PlannedSection[] = [
  {
    folder: "01-courses",
    title: "Курсы",
    parts: [
      { file: "01-create-course", title: "Часть 1. Создание курса" },
      { file: "02-course-page", title: "Часть 2. Страница курса" },
      { file: "03-add-theme", title: "Часть 3. Добавление темы" },
      { file: "04-materials", title: "Часть 4. Учебные материалы" },
    ],
  },
  {
    folder: "02-testing",
    title: "Тестирование",
    parts: [
      { file: "01-create-test", title: "Часть 1. Создание теста" },
      { file: "02-question-bank", title: "Часть 2. Коллекция вопросов" },
    ],
  },
  {
    folder: "03-start",
    title: "Начало работы",
    parts: [{ file: "01-login", title: "Часть 1. Вход в систему" }],
  },
];

const videoFiles = import.meta.glob("../videos/**/*.{mp4,webm,mov,m4v}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

type DiscoveredVideo = {
  folder: string;
  fileBase: string;
  src: string;
};

function humanize(name: string) {
  const withoutOrder = name.replace(/^\d+[-_\s]+/, "");
  const text = withoutOrder.replace(/[-_]+/g, " ").trim();
  if (!text) return name;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function discoverVideos(): DiscoveredVideo[] {
  return Object.entries(videoFiles)
    .map(([path, src]) => {
      const parts = path.split("/");
      const fileName = parts.at(-1) ?? "";
      const folder = parts.at(-2) ?? "";
      const fileBase = fileName.replace(/\.[^.]+$/, "");
      return { folder, fileBase, src };
    })
    .filter((video) => video.folder && video.fileBase && video.src);
}

function findVideo(videos: DiscoveredVideo[], folder: string, file: string) {
  return videos.find(
    (video) =>
      video.folder === folder &&
      (video.fileBase === file || video.fileBase.startsWith(`${file}.`))
  );
}

export function buildGuideSections(): GuideSection[] {
  const videos = discoverVideos();
  const used = new Set<string>();

  const planned = PLANNED_SECTIONS.map((section) => {
    const parts: GuidePart[] = section.parts.map((part) => {
      const match = findVideo(videos, section.folder, part.file);
      if (match) {
        used.add(`${match.folder}/${match.fileBase}`);
      }
      return {
        id: `${section.folder}/${part.file}`,
        title: part.title,
        src: match?.src ?? null,
      };
    });

    const extras = videos
      .filter(
        (video) =>
          video.folder === section.folder &&
          !used.has(`${video.folder}/${video.fileBase}`)
      )
      .sort((a, b) => a.fileBase.localeCompare(b.fileBase, "ru"));

    extras.forEach((video) => {
      used.add(`${video.folder}/${video.fileBase}`);
      parts.push({
        id: `${video.folder}/${video.fileBase}`,
        title: humanize(video.fileBase),
        src: video.src,
      });
    });

    return {
      id: section.folder,
      title: section.title,
      parts,
    };
  });

  const extraFolders = [
    ...new Set(
      videos
        .filter((video) => !used.has(`${video.folder}/${video.fileBase}`))
        .map((video) => video.folder)
    ),
  ].sort((a, b) => a.localeCompare(b, "ru"));

  const discovered = extraFolders.map((folder) => ({
    id: folder,
    title: humanize(folder),
    parts: videos
      .filter((video) => video.folder === folder)
      .sort((a, b) => a.fileBase.localeCompare(b.fileBase, "ru"))
      .map((video) => ({
        id: `${video.folder}/${video.fileBase}`,
        title: humanize(video.fileBase),
        src: video.src,
      })),
  }));

  return [...planned, ...discovered];
}
