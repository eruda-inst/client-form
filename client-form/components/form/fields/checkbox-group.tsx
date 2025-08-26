"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OptionsQuestion } from "@/lib/types";

export const CheckboxGroupInput = ({ question, control }: { question: OptionsQuestion, control: any }) => (
  <FormItem>
    <FormLabel>{question.label}</FormLabel>
    {question.options.map((option) => (
      <FormField
        key={option.value}
        control={control}
        name={question.id}
        render={({ field }) => {
          const fieldValue = field.value || [];
          return (
            <FormItem
              key={option.value}
              className="flex flex-row items-start space-x-3 space-y-0"
            >
              <FormControl>
                <Checkbox
                  checked={fieldValue.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([
                        ...fieldValue,
                        option.value,
                      ]);
                    } else {
                      field.onChange(
                        fieldValue.filter(
                          (value: string) => value !== option.value
                        )
                      );
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal">
                {option.label}
              </FormLabel>
            </FormItem>
          );
        }}
      />
    ))}
    <FormMessage />
  </FormItem>
);
