"use client";

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextInputQuestion } from "@/lib/types";

interface Props {
  question: TextInputQuestion;
  control: any;
}

const cnpjMask = (value: string) => {
  if (!value) return "";
  const onlyNumbers = value.replace(/\D/g, "");
  return onlyNumbers
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export function CnpjInput({ question, control }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <Label htmlFor={question.id} className="font-semibold">{question.texto}</Label>
        {question.descricao && <p className="font-light">{question.descricao}</p>}
      </div>
      <Controller
        name={question.id}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            onChange={(e) => field.onChange(cnpjMask(e.target.value))}
            placeholder={question.placeholder}
            required={question.obrigatoria}
          />
        )}
      />
    </div>
  );
}
