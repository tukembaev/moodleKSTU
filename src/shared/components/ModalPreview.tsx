import { CourseMaterials } from "entities/Course/model/types/course";
import React from "react";

import { LuFileQuestion } from "react-icons/lu";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "shared/shadcn/ui/dialog";

interface ModalPreviewProps {
  data: CourseMaterials;
}

const ModalPreview: React.FC<ModalPreviewProps> = ({ data }) => {
  const extension = data.file?.split(".").pop()?.toLowerCase();

  return (
    <DialogContent className="max-w-screen-2xl w-[90vw] h-[75vh] inline-block">
      <DialogHeader className="pb-4">
        <DialogTitle>{data.file_name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 h-full">
        {(() => {
          if (["mp4", "mkv", "avi", "mov", "webm"].includes(extension || "")) {
            return (
              <video controls className="w-full h-full">
                <source src={data.file} type={`video/${extension}`} />
              </video>
            );
          }

          if (["pdf"].includes(extension || "")) {
            return (
              <iframe
                src={data.file}
                className="w-full h-full"
                title="PDF Preview"
              />
            );
          }

          if (["mp3", "wav", "flac", "aac", "ogg"].includes(extension || "")) {
            return (
              <audio controls className="w-full">
                <source src={data.file} type={`audio/${extension}`} />
              </audio>
            );
          }

          return (
            <div className="flex items-center gap-2">
              <LuFileQuestion />
              <a
                href={data.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {data.file}
              </a>
            </div>
          );
        })()}
      </div>
    </DialogContent>
  );
};
export default ModalPreview;
