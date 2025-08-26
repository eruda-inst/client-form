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
        <FormLabel>{question.label}</FormLabel>
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
