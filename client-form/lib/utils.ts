import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormDefinition, Question, TextInputQuestion, OptionsQuestion, NPSQuestion, Option, QuestionType, SliderQuestion, SwitchQuestion, DatePickerQuestion } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to map old question types to new QuestionType
function mapOldQuestionTypeToNew(oldType: string): QuestionType {
  switch (oldType) {
    case "texto_simples":
      return "text_input"
    case "texto_longo":
      return "textarea_input"
    case "multipla_escolha":
      return "radio" // Assuming radio for multiple choice, can be 'select' if needed
    case "caixa_selecao":
      return "checkbox_group"
    case "data":
      return "date_picker"
    case "numero":
      return "number_input"
    case "nps":
      return "nps"
    default:
      return "text_input" // Default to text_input or throw an error for unknown types
  }
}

export function mapApiFormToFormDefinition(apiForm: any): FormDefinition {
  console.log("API Form received:", apiForm); // Debugging line
  console.log("API Form perguntas:", apiForm.perguntas); // Debugging line

  const questions: Question[] = apiForm.perguntas.filter((apiQuestion: any) => apiQuestion.ativa).map((apiQuestion: any) => {
    const newType = mapOldQuestionTypeToNew(apiQuestion.tipo)

    const baseQuestion = {
      id: apiQuestion.id,
      label: apiQuestion.texto,
      type: newType,
      required: apiQuestion.obrigatoria,
      order: apiQuestion.ordem_exibicao,
      description: apiQuestion.texto, // Using texto as description for now, adjust if needed
    }

    switch (newType) {
      case "text_input":
      case "textarea_input":
      case "number_input":
        return {
          ...baseQuestion,
          type: newType,
          placeholder: apiQuestion.texto, // Using texto as placeholder for now
        } as TextInputQuestion
      case "radio":
      case "checkbox_group":
        const options: Option[] = apiQuestion.opcoes.map((apiOption: any) => ({
          value: apiOption.id, // Using option id as value
          label: apiOption.texto,
        }))
        return {
          ...baseQuestion,
          type: newType,
          options: options,
        } as OptionsQuestion
      case "nps":
        return {
          ...baseQuestion,
          type: "nps",
          min: apiQuestion.escala_min,
          max: apiQuestion.escala_max,
          // minLabel and maxLabel are not in the API response, so they will be undefined
        } as NPSQuestion
      case "date_picker":
        return {
          ...baseQuestion,
          type: "date_picker",
        } as DatePickerQuestion
      // Add cases for 'switch' and 'slider' if they exist in your API response
      // For now, they are not explicitly in the provided API response, so they won't be mapped.
      default:
        return baseQuestion as Question // Fallback for unhandled types
    }
  })

  return {
    id: apiForm.id,
    title: apiForm.titulo,
    description: apiForm.descricao,
    questions: questions,
    createdAt: apiForm.criado_em,
    updatedAt: apiForm.atualizado_em,
  }
}