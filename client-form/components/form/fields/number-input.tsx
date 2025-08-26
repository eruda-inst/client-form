"use client";

import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Question } from "@/lib/types";

export const NumberInput = ({ question, control }: { question: Question, control: any }) => (
  <FormField
    control={control}
    name={question.id}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{question.label}</FormLabel>
        <FormControl>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="escreva um número"
            {...field}
            onChange={(e) => {
              const value = e.target.value;
              const sanitized = value.replace(/[^0-9]/g, '');
              if (sanitized === '') {
                field.onChange(undefined);
              } else {
                field.onChange(parseInt(sanitized, 10));
              }
            }}
            value={field.value ?? ''}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
