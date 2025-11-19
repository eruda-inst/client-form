"use client";

import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SliderQuestion } from "@/lib/types";

export const SliderInput = ({ question, control }: { question: SliderQuestion, control: any }) => (
  <FormField
    control={control}
    name={question.id}
    render={({ field }) => (
      <FormItem>
        <div className="flex flex-col">
          <FormLabel className="font-semibold">{question.texto}</FormLabel>
          {question.descricao && <p className="font-light">{question.descricao}</p>}
        </div>
        <FormControl>
          <Slider
            value={[field.value]}
            onValueChange={(value) => field.onChange(value[0])}
            min={question.min}
            max={question.max}
            step={question.step}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
