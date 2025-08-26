"use client";

import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Question } from "@/lib/types";

export const TextareaInput = ({ question, control }: { question: Question, control: any }) => (
  <FormField
    control={control}
    name={question.id}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{question.label}</FormLabel>
        <FormControl>
          <Textarea placeholder={question.placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
