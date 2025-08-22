// lib/types.ts

export type QuestionType =
  | "text_input" // Para input de texto simples (anteriormente "texto_simples")
  | "textarea_input" // Para input de texto longo (anteriormente "texto_longo")
  | "radio" // Para múltipla escolha com radio buttons (anteriormente "multipla_escolha")
  | "select" // Para múltipla escolha com dropdown (alternativa para "multipla_escolha")
  | "checkbox_group" // Para múltiplas seleções com checkboxes (anteriormente "caixa_selecao")
  | "date_picker" // Para seleção de data (anteriormente "data")
  | "number_input" // Para input de número (anteriormente "numero")
  | "switch" // Para toggles (novo)
  | "slider" // Para seleção de range (novo)
  | "nps"; // Para perguntas NPS (mantido)

interface QuestionBase {
  id: string;
  label: string; // O texto da pergunta
  type: QuestionType;
  required: boolean;
  order: number; // Ordem de exibição
  description?: string; // Texto adicional/descrição da pergunta
}

export interface TextInputQuestion extends QuestionBase {
  type: "text_input" | "textarea_input" | "number_input";
  placeholder?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface OptionsQuestion extends QuestionBase {
  type: "radio" | "select" | "checkbox_group";
  options: Option[];
}

export interface DatePickerQuestion extends QuestionBase {
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

export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}