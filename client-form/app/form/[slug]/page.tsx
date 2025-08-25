"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormDefinition, Question, OptionsQuestion, NPSQuestion, TextInputQuestion, SliderQuestion, SwitchQuestion, DatePickerQuestion } from "@/lib/types"
import { useParams } from "next/navigation"
import { mapApiFormToFormDefinition } from "@/lib/utils"

export default function FormPage() {
  const params = useParams()
  const slug = params.slug as string
  const [form, setForm] = useState<FormDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // Mock API call for now, replace with actual API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formularios/publico/${slug}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const rawData: any = await response.json()
        if (rawData) {
          const mappedForm = mapApiFormToFormDefinition(rawData)
          setForm(mappedForm)
        } else {
          setError("Formulário não encontrado.")
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [slug])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando formulário...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Erro: {error}</div>
  }

  if (!form) {
    return <div className="flex justify-center items-center min-h-screen">Formulário não disponível.</div>
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "text_input":
      case "textarea_input":
      case "number_input":
        const textInputQuestion = question as TextInputQuestion
        return (
          <div key={textInputQuestion.id} className="mb-4">
            <label htmlFor={textInputQuestion.id} className="block text-sm font-medium text-gray-700">
              {textInputQuestion.label} {textInputQuestion.required && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={textInputQuestion.id}
              type={textInputQuestion.type === "number_input" ? "number" : "text"}
              placeholder={textInputQuestion.placeholder}
              required={textInputQuestion.required}
              className="mt-1 block w-full"
            />
          </div>
        )
      case "radio":
      case "select":
      case "checkbox_group":
        const optionsQuestion = question as OptionsQuestion
        return (
          <div key={optionsQuestion.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {optionsQuestion.label} {optionsQuestion.required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2 space-y-2">
              {optionsQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={`${optionsQuestion.id}-${index}`}
                    name={optionsQuestion.id}
                    type={optionsQuestion.type === "radio" ? "radio" : "checkbox"}
                    required={optionsQuestion.required && optionsQuestion.type === "radio"}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor={`${optionsQuestion.id}-${index}`} className="ml-3 block text-sm text-gray-900">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      case "nps":
        const npsQuestion = question as NPSQuestion
        return (
          <div key={npsQuestion.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {npsQuestion.label} {npsQuestion.required && <span className="text-red-500">*</span>}
            </label>
            <div className="mt-2 flex justify-between text-sm">
              <span>{npsQuestion.minLabel || npsQuestion.min}</span>
              <span>{npsQuestion.maxLabel || npsQuestion.max}</span>
            </div>
            <Input
              id={npsQuestion.id}
              type="range"
              min={npsQuestion.min}
              max={npsQuestion.max}
              required={npsQuestion.required}
              className="mt-1 block w-full"
            />
          </div>
        )
      case "date_picker":
        const datePickerQuestion = question as DatePickerQuestion
        return (
          <div key={datePickerQuestion.id} className="mb-4">
            <label htmlFor={datePickerQuestion.id} className="block text-sm font-medium text-gray-700">
              {datePickerQuestion.label} {datePickerQuestion.required && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={datePickerQuestion.id}
              type="date"
              required={datePickerQuestion.required}
              className="mt-1 block w-full"
            />
          </div>
        )
      case "switch":
        const switchQuestion = question as SwitchQuestion
        return (
          <div key={switchQuestion.id} className="mb-4 flex items-center justify-between">
            <label htmlFor={switchQuestion.id} className="block text-sm font-medium text-gray-700">
              {switchQuestion.label} {switchQuestion.required && <span className="text-red-500">*</span>}
            </label>
            {/* You'll need to import and use the Shadcn UI Switch component here */}
            <Input
              id={switchQuestion.id}
              type="checkbox"
              required={switchQuestion.required}
              className="h-4 w-4 text-indigo-600 border-gray-300"
            />
          </div>
        )
      case "slider":
        const sliderQuestion = question as SliderQuestion
        return (
          <div key={sliderQuestion.id} className="mb-4">
            <label htmlFor={sliderQuestion.id} className="block text-sm font-medium text-gray-700">
              {sliderQuestion.label} {sliderQuestion.required && <span className="text-red-500">*</span>}
            </label>
            {/* You'll need to import and use the Shadcn UI Slider component here */}
            <Input
              id={sliderQuestion.id}
              type="range"
              min={sliderQuestion.min}
              max={sliderQuestion.max}
              step={sliderQuestion.step}
              required={sliderQuestion.required}
              className="mt-1 block w-full"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-2xl p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{form.title}</h1>
        <p className="text-gray-500">{form.description}</p>
      </div>
      <form className="space-y-6">
        {form.questions.map((question) => renderQuestion(question))}
        <Button type="submit" className="w-full">
          Enviar Respostas
        </Button>
      </form>
    </div>
  )
}