"use client";

import { DatePicker } from "@/components/ui/date-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePickerQuestion } from "@/lib/types";

export const DatePickerInput = ({ question, control }: { question: DatePickerQuestion, control: any }) => (
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
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder={question.placeholder}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
