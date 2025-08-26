"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NPSQuestion } from "@/lib/types";

export const NpsInput = ({ question, control }: { question: NPSQuestion, control: any }) => {
  const npsOptions = Array.from(
    { length: question.max - question.min + 1 },
    (_, i) => question.min + i
  );

  return (
    <FormField
      control={control}
      name={question.id}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{question.label}</FormLabel>
          <FormControl>
            {npsOptions.length > 15 ? (
              <Input
                type="number"
                {...field}
                onChange={(e) =>
                  field.onChange(parseInt(e.target.value, 10))
                }
                min={question.min}
                max={question.max}
              />
            ) : (
              <RadioGroup
                onValueChange={(value) =>
                  field.onChange(parseInt(value, 10))
                }
                value={field.value?.toString()}
                className="flex flex-wrap justify-center gap-1"
              >
                {npsOptions.map((value) => (
                  <Label
                    key={value}
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border p-3 hover:bg-accent/50 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={value.toString()}
                        id={value.toString()}
                        className="sr-only"
                      />
                    </FormControl>
                    <span className="text-base font-medium">{value}</span>
                  </Label>
                ))}
              </RadioGroup>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
