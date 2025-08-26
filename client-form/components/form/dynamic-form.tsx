"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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

  const defaultValues = formDef.questions.reduce((acc, q) => {
    if (q.type === "checkbox_group") {
      acc[q.id] = [];
    } else if ("defaultValue" in q) {
      acc[q.id] = q.defaultValue;
    }
    return acc;
  }, {} as Record<string, any>);

  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);

    const itens = formDef.questions.map((question) => {
      const item: any = {
        pergunta_id: question.id,
      };

      // Determine the value based on question type
      switch (question.type) {
        case "text_input":
        case "textarea_input":
          item.valor_texto = values[question.id];
          break;
        case "number_input":
          item.valor_numero = values[question.id];
          break;
        case "radio":
          // Find the selected option to get its ID
          const selectedRadioOption = (question as OptionsQuestion).options.find(
            (option) => option.value === values[question.id]
          );
          if (selectedRadioOption) {
            item.valor_opcao_id = selectedRadioOption.value;
          }
          break;
        case "checkbox_group":
          // For checkbox group, values[question.id] will be an array of selected option values
          // We need to map these to an array of objects with valor_opcao_id and valor_opcao_texto
          item.valor_multiplas_opcoes = (values[question.id] as string[]).map(
            (selectedValue: string) => {
              const selectedOption = (question as OptionsQuestion).options.find(
                (option) => option.value === selectedValue
              );
              return {
                valor_opcao_id: selectedOption?.value,
                valor_opcao_texto: selectedOption?.label,
              };
            }
          );
          break;
        case "nps":
        case "slider":
          item.valor_numero = values[question.id];
          break;
        case "date_picker":
          item.valor_texto = values[question.id]
            ? new Date(values[question.id] as string | number | Date)
                .toISOString()
                .split("T")[0]
            : null; // Format as YYYY-MM-DD
          break;
        case "switch":
          item.valor_booleano = values[question.id];
          break;
        default:
          // Handle other types or log a warning
          console.warn(`Unhandled question type: ${question.type}`);
          break;
      }
      return item;
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Form submission successful:", result);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally, show an error message
    }
  };

  const FormContent = () => (
    <>
      <CardHeader>
        <CardTitle>{formDef.title}</CardTitle>
        <CardDescription>{formDef.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {formDef.questions
              .sort((a, b) => a.order - b.order)
              .map((question) => (
                <RenderQuestion
                  key={question.id}
                  question={question}
                  control={formMethods.control}
                />
              ))}
            <Button type="submit">Enviar</Button>
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
