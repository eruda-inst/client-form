// lib/types.ts

export type QuestionType =
  | "text_input" // Para input de texto simples (anteriormente "texto_simples")
  | "textarea_input" // Para input de texto longo (anteriormente "texto_longo")
  | "radio" // Para múltipla escolha com radio buttons (anteriormente "multipla_escolha")
  | "select" // Para múltipla escolha com dropdown (alternativa para "multipla_escolha")
  | "caixa_selecao" // Para múltiplas seleções com checkboxes
  | "date_picker" // Para seleção de data (anteriormente "data")
  | "number_input" // Para input de número (anteriormente "numero")
  | "switch" // Para toggles (novo)
  | "slider" // Para seleção de range (novo)
  | "nps" // Para perguntas NPS (mantido)
  | "telefone"
  | "email"
  | "cnpj";

export interface QuestionBase {
  id: string;
  bloco_id: string;
  label: string;
  required: boolean;
  ordem_exibicao: number;
  description?: string;
}

export interface TextInputQuestion extends QuestionBase {
  type: "text_input" | "textarea_input" | "number_input" | "telefone" | "email" | "cnpj";
  placeholder?: string;
  defaultValue?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface OptionsQuestion extends QuestionBase {
  type: "radio" | "select" | "caixa_selecao"; // 'select' was missing
  options: Option[];
  defaultValue?: string | string[];
}

export interface DatePickerQuestion extends QuestionBase {
  placeholder?: string;
  type: "date_picker";
  defaultValue?: Date;
}

export interface SwitchQuestion extends QuestionBase {
  type: "switch";
  defaultValue?: boolean;
}

export interface SliderQuestion extends QuestionBase {
  type: "slider";
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
}

export interface NPSQuestion extends QuestionBase {
  type: "nps";
  minLabel?: string;
  maxLabel?: string;
  min: number;
  max: number;
}

export type Question =
  | TextInputQuestion
  | OptionsQuestion
  | DatePickerQuestion
  | SwitchQuestion
  | SliderQuestion
  | NPSQuestion;

export interface Block {
  id: string;
  title: string;
  description?: string;
}

export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  blocks: Block[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}