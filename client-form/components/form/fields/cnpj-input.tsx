"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextInputQuestion } from "@/lib/types";
import InputMask from "react-input-mask";

interface Props {
  question: TextInputQuestion;
  control: any;
}

export function CnpjInput({ question, control }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={question.id}>{question.label}</Label>
      <Controller
        name={question.id}
        control={control}
        render={({ field }) => (
          <InputMask
            mask="99.999.999/9999-99"
            value={field.value}
            onChange={field.onChange}
          >
            {(inputProps: any) => (
              <Input
                {...inputProps}
                id={question.id}
                placeholder={question.placeholder}
                required={question.required}
              />
            )}
          </InputMask>
        )}
      />
    </div>
  );
}
