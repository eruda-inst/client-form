"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
} from "@/components/ui/form";
import {
  FormDefinition,
  OptionsQuestion,
} from "@/lib/types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createFormSchema } from "@/lib/schemas";
import { RenderQuestion } from "./render-question";
import { SubmissionSuccess } from "./submission-success";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function DynamicForm({
  formDef,
  slug,
}: {
  formDef: FormDefinition;
  slug: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formSchema = createFormSchema(formDef.questions);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  // Group questions by block
  const questionsByBlock = formDef.questions.reduce((acc, question) => {
    const blockId = question.bloco_id;
    if (!acc[blockId]) {
      acc[blockId] = [];
    }
    acc[blockId].push(question);
    return acc;
  }, {} as Record<string, typeof formDef.questions>);

  const blockIds = Object.keys(questionsByBlock);
  const currentBlockId = blockIds[currentBlockIndex];
  const currentQuestions = questionsByBlock[currentBlockId];

  const defaultValues = formDef.questions.reduce((acc, q) => {
    if (q.type === "caixa_selecao") {
      acc[q.id] = [];
    } else if ("defaultValue" in q) {
      acc[q.id] = q.defaultValue;
    } else {
      // Provide a sensible default for other types to avoid uncontrolled component errors
      acc[q.id] = "";
    }
    return acc;
  }, {} as Record<string, any>);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);

    const itens = formDef.questions.flatMap((question) => {
      if (question.type === "caixa_selecao") {
        const selectedOptions = values[question.id] as { pergunta_id: string, valor_opcao_id: string }[];
        if (selectedOptions && selectedOptions.length > 0) {
          return selectedOptions.map((selectedOption) => ({
            pergunta_id: question.id,
            valor_opcao_id: selectedOption.valor_opcao_id,
          }));
        } else {
          return [];
        }
      } else {
        const item: any = {
          pergunta_id: question.id,
        };

        // Determine the value based on question type
        switch (question.type) {
          case "text_input":
          case "textarea_input":
          case "email":
          case "telefone":
          case "cnpj":
            item.valor_texto = values[question.id];
            break;
          case "number_input":
            item.valor_numero = values[question.id];
            break;
          case "radio":
            const selectedRadioOption = (question as OptionsQuestion).options.find(
              (option) => option.value === values[question.id]
            );
            if (selectedRadioOption) {
              item.valor_opcao_id = selectedRadioOption.value;
            }
            break;
          case "nps":
          case "slider":
            item.valor_numero = values[question.id];
            break;
          case "date_picker":
            item.valor_data = values[question.id]
              ? new Date(values[question.id] as string | number | Date)
                  .toISOString()
                  .split("T")[0]
              : null;
            break;
          case "switch":
            item.valor_booleano = values[question.id];
            break;
          default:
            console.warn(`Unhandled question type: ${question.type}`);
            break;
        }
        return item;
      }
    });

    const submissionPayload = {
      itens: itens,
      origem_ip: "string", // Placeholder, ideally obtained from server or a client-side utility
      user_agent: navigator.userAgent, // Get user agent from browser
      meta: {}, // Can be extended if needed
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/respostas/${slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionPayload),
        }
      );

      if (!response.ok) {
        // Try to parse the error response from the backend
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          // Example detail: "Pergunta d5f6843f-3d36-4301-a93d-7447de76cda6: CNPJ inválido"
          const match = errorData.detail.match(/Pergunta (.*?): (.*)/);
          if (match) {
            const [, questionId, errorMessage] = match;
            const question = formDef.questions.find(q => q.id === questionId);
            const friendlyMessage = question
              ? `Erro no campo "${question.label}": ${errorMessage}`
              : errorMessage;
            throw new Error(friendlyMessage);
          }
        }
        throw new Error(`Erro na API: ${errorData.detail}`);
      }

      const result = await response.json();
      console.log("Form submission successful:", result);
      setIsSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
      console.error("Error submitting form:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = currentQuestions.map((q) => q.id);
    const isValid = await formMethods.trigger(fieldsToValidate);

    if (isValid) {
      if (currentBlockIndex < blockIds.length - 1) {
        setCurrentBlockIndex(currentBlockIndex + 1);
      }
    } else {
      toast.error("Por favor, preencha os campos corretamente antes de avançar.");
      console.log("Validation errors:", formMethods.formState.errors);
    }
  };

  const handlePrevious = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const FormContent = () => (
    <>
      <CardHeader>
        <CardTitle className="text-3xl">{formDef.title}</CardTitle>
        <CardDescription>{formDef.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <div className="space-y-2">
              <Progress
                value={((currentBlockIndex + 1) / blockIds.length) * 100}
              />
              <p className="text-sm text-muted-foreground">
                Etapa {currentBlockIndex + 1} de {blockIds.length}
              </p>
            </div>

            <CardTitle>
              {formDef.blocks.find(b => b.id === currentBlockId)?.title ||
                `Bloco ${currentBlockIndex + 1}`}
            </CardTitle>
            {currentQuestions
              .sort((a, b) => a.ordem_exibicao - b.ordem_exibicao)
              .map((question) => (
                <RenderQuestion
                  key={question.id}
                  question={question}
                  control={formMethods.control}
                />
              ))}
            <div className="flex justify-between">
              {currentBlockIndex > 0 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              <div />
              {currentBlockIndex < blockIds.length - 1 ? (
                <Button type="button" onClick={handleNext} disabled={formMethods.formState.isSubmitting}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">Enviar</Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );

  return (
    <div className="w-full transition-all duration-300 max-w-2xl p-4 mx-auto">
      {isSubmitted ? (
        isDesktop ? (
          <Card className="flex items-center justify-center p-0 border-none bg-transparent">
            <SubmissionSuccess />
          </Card>
        ) : (
          <SubmissionSuccess />
        )
      ) : isDesktop ? (
        <Card>
          <FormContent />
        </Card>
      ) : (
        <FormContent />
      )}
    </div>
  );
}
