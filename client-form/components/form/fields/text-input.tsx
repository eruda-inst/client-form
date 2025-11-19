"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Question, TextInputQuestion } from "@/lib/types";

export const TextInput = ({ question, control }: { question: TextInputQuestion, control: any }) => (
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
          <Input placeholder={question.placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
