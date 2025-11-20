import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "shared/shadcn/ui/accordion";

export type TextSection = {
  heading: string;
  sub_heading: string;
  text: string;
};

export type TextGroup = {
  content: TextSection[];
};

export type TextBlockProps = {
  data: TextGroup[];
};

const TextBlock: React.FC<TextBlockProps> = ({ data }) => {
  return (
    <div className="space-y-6 w-full">
      {data.map((group, i) => (
        <div key={i} className="space-y-2 ">
          <Accordion type="single" collapsible className="w-full">
            {group.content.map((section, j) => (
              <AccordionItem value={`item-${i}-${j}`} key={j}>
                <AccordionTrigger className="text-2xl tracking-tight pb-6">
                  {section.heading}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3">
                  <h3 className="text-md font-semibold">
                    {section.sub_heading}
                  </h3>
                  <p>{section.text}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default TextBlock;
