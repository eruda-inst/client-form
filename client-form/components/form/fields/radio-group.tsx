"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OptionsQuestion } from "@/lib/types";

export const RadioGroupInput = ({ question, control }: { question: OptionsQuestion, control: any }) => (
  <FormField
    control={control}
    name={question.id}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{question.label}</FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="grid gap-3"
          >
            {question.options.map((option) => (
              <Label
                key={option.value}
                className="hover:bg-accent/50  flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950"
              >
                <FormControl>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                  />
                </FormControl>
                <div className="grid gap-1.5 font-normal">
                  <p className="text-sm leading-none font-medium">
                    {option.label}
                  </p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
