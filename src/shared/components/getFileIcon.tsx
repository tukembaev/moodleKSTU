import {
  LuFileImage,
  LuFileMusic,
  LuFileVideo,
  LuFileArchive,
  LuFileQuestion,
  LuFileSpreadsheet,
} from "react-icons/lu";

const GetFileIcon = ({ file_names }: { file_names: string }) => {
  const imageExtensions = ["svg", "png", "jpg", "jpeg", "gif", "webp"];
  const musicExtensions = ["mp3", "wav", "flac", "aac", "ogg"];
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
  ];
  const videoExtensions = ["mp4", "mkv", "avi", "mov", "webm"];
  const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];

  const extension = (file_names.split(".").pop() || "").toLowerCase();

  if (imageExtensions.includes(extension))
    return <LuFileImage className="size-7" />;
  if (musicExtensions.includes(extension))
    return <LuFileMusic className="size-7" />;
  if (documentExtensions.includes(extension))
    return <LuFileSpreadsheet className="size-7" />;
  if (videoExtensions.includes(extension))
    return <LuFileVideo className="size-7" />;
  if (archiveExtensions.includes(extension))
    return <LuFileArchive className="size-7" />;

  return <LuFileQuestion className="size-7" />;
};

export default GetFileIcon;
