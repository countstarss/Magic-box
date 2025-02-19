import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface QuestionAndAnswerProps {
  items: {
    id: number;
    question: string;
    answer: string;
  }[];
}

export function QuestionAndAnswer({
  items
}: QuestionAndAnswerProps) {

  return (
    <div className='mx-4 py-20'>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          FAQ
        </h2>
        <p className="text-lg text-muted-foreground">
          常见问题
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-[1370px] p-6 md:px-10 mx-auto mt-auto flex flex-col text-sm dark:text-white/70 bg-white dark:bg-white/10 rounded-sm">
        {
          items.map((item) => (
            <AccordionItem key={item.id} value={item.id.toString()}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))
        }
      </Accordion>
    </div>
  );
}

export default QuestionAndAnswer;