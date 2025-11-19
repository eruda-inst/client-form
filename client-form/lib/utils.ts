import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormDefinition, Question, TextInputQuestion, OptionsQuestion, NPSQuestion, Option, QuestionType, SliderQuestion, SwitchQuestion, DatePickerQuestion } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function mapOldQuestionTypeToNew(oldType: string): QuestionType {
  switch (oldType) {
    case "texto_simples":
      return "text_input"
    case "texto_longo":
      return "textarea_input"
    case "multipla_escolha":
      return "radio" // Assuming radio for multiple choice, can be 'select' if needed
    case "caixa_selecao":
      return "caixa_selecao"
    case "data":
      return "date_picker"
    case "numero":
      return "number_input"
    case "nps":
      return "nps"
    case "telefone":
      return "telefone"
    case "email":
      return "email"
    case "cnpj":
      return "cnpj"
    default:
      return "text_input" // Default to text_input or throw an error for unknown types
  }
}

export function mapApiFormToFormDefinition(apiForm: any): FormDefinition {
  const blocks = (apiForm.blocos || []).map((apiBlock: any) => ({
    id: apiBlock.id,
    titulo: apiBlock.titulo,
    descricao: apiBlock.descricao,
    ordem: apiBlock.ordem_exibicao,
  }));

  const questions: Question[] = apiForm.perguntas.filter((apiQuestion: any) => apiQuestion.ativa).map((apiQuestion: any) => {
    const newType = mapOldQuestionTypeToNew(apiQuestion.tipo)

    const baseQuestion = {
      id: apiQuestion.id,
      bloco_id: apiQuestion.bloco_id,
      texto: apiQuestion.texto,
      type: newType,
      obrigatoria: apiQuestion.obrigatoria,
      ordem_exibicao: apiQuestion.ordem_exibicao,
      descricao: apiQuestion.descricao,
    }

    switch (newType) {
      case "text_input":
      case "textarea_input":
      case "number_input":
      case "telefone":
      case "email":
      case "cnpj":
        return {
          ...baseQuestion,
          type: newType,
          placeholder: apiQuestion.texto, // Using texto as placeholder for now
        } as TextInputQuestion
      case "radio":
      case "caixa_selecao":
        const options: Option[] = apiQuestion.opcoes.map((apiOption: any) => ({
          value: apiOption.id, // Using option id as value
          texto: apiOption.texto,
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
    titulo: apiForm.titulo,
    descricao: apiForm.descricao,
    blocks: blocks,
    questions: questions,
    createdAt: apiForm.criado_em,
    updatedAt: apiForm.atualizado_em,
  }
}