import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

export function Bento() {
  return (
    <BentoGrid>
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 0 || i === 0 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton1 = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img
      src="/images/GhostForest.jpg"
      alt="HSK"
      width={1000}
      height={1000}
      className='object-fill rounded-md'
    />
  </div>
);
const Skeleton2 = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img
      src="/images/HauntedEdinburgh.jpg"
      alt="HSK"
      width={1000}
      height={1000}
      className='object-fill rounded-md'
    />
  </div>
);
const Skeleton3 = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img
      src="/images/SoranoItaly.jpg"
      alt="HSK"
      width={1000}
      height={1000}
      className='object-fill rounded-md'
    />
  </div>
);
const Skeleton4 = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img
      src="/images/SoranoItaly.jpg"
      alt="HSK"
      width={1000}
      height={1000}
      className='object-fill rounded-md'
    />
  </div>
);
const Skeleton5 = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
    <img
      src="/images/SoranoItaly.jpg"
      alt="HSK"
      width={1000}
      height={1000}
      className='object-fill rounded-md'
    />
  </div>
);


// 将item的内容改写为课程描述

const items = [
  {
    title: "HSK 考试备考",
    description: "系统化准备HSK考试，掌握考试技巧和重点词汇。",
    header: <Skeleton1 />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "商务中文",
    description: "学习职场必备中文技能，掌握商务谈判和邮件写作。",
    header: <Skeleton2 />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "中文写作进阶",
    description: "提升中文写作能力，学习各类文体的写作技巧。",
    header: <Skeleton3 />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "口语会话训练",
    description: "提高日常交际能力，练习地道的中文表达方式。",
    header: <Skeleton4 />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "中国文化探索",
    description: "深入了解中国传统文化，体验语言背后的文化魅力。",
    header: <Skeleton5 />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
];
