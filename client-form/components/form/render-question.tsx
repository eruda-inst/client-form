"use client";

import { Question, NPSQuestion, OptionsQuestion, DatePickerQuestion, SliderQuestion, SwitchQuestion } from "@/lib/types";
import { TextInput } from "./fields/text-input";
import { TextareaInput } from "./fields/textarea-input";
import { NumberInput } from "./fields/number-input";
import { RadioGroupInput } from "./fields/radio-group";
import { CheckboxGroupInput } from "./fields/checkbox-group";
import { NpsInput } from "./fields/nps";
import { DatePickerInput } from "./fields/date-picker";
import { SwitchInput } from "./fields/switch";
import { SliderInput } from "./fields/slider";

export const RenderQuestion = ({
  question,
  control,
}: {
  question: Question;
  control: any;
}) => {
  switch (question.type) {
    case "text_input":
      return <TextInput question={question} control={control} />;
    case "textarea_input":
      return <TextareaInput question={question} control={control} />;
    case "number_input":
      return <NumberInput question={question} control={control} />;
    case "radio":
      return <RadioGroupInput question={question as OptionsQuestion} control={control} />;
    case "checkbox_group":
      return <CheckboxGroupInput question={question as OptionsQuestion} control={control} />;
    case "nps":
      return <NpsInput question={question as NPSQuestion} control={control} />;
    case "date_picker":
      return <DatePickerInput question={question as DatePickerQuestion} control={control} />;
    case "switch":
      return <SwitchInput question={question as SwitchQuestion} control={control} />;
    case "slider":
      return <SliderInput question={question as SliderQuestion} control={control} />;
    default:
      return <></>;
  }
};
