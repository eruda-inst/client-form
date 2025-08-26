"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { OptionsQuestion } from "@/lib/types";

export const CaixaSelecaoInput = ({ question, control }: { question: OptionsQuestion, control: any }) => (
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
            <Label
              key={option.value}
              className="hover:bg-accent/50  flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950"
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
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  {option.label}
                </p>
              </div>
            </Label>
          );
        }}
      />
    ))}
    <FormMessage />
  </FormItem>
);
