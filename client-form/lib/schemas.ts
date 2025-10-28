"use client";
import * as z from "zod";
import { Question } from "@/lib/types";

// Helper to create the Zod schema from the form definition
export function createFormSchema(questions: Question[]) {
  const schemaObject = questions.reduce((acc, q) => {
    let fieldSchema: z.ZodTypeAny;

    switch (q.type) {
      case "text_input":
      case "textarea_input":
      case "radio": {
        let schema = z.string();
        if (q.required) {
          fieldSchema = schema.min(1, "Campo obrigatório");
        } else {
          fieldSchema = schema.optional().or(z.literal("")); // Treat empty string as valid for optional
        }
        break;
      }
      case "email": {
        let schema = z.string().email("E-mail inválido");
        if (q.required) {
          fieldSchema = schema.min(1, "Campo obrigatório");
        } else {
          fieldSchema = schema.optional().or(z.literal(""));
        }
        break;
      }
      case "telefone": {
        let schema = z.string().regex(/^\d{11}$/, "Telefone inválido");
        if (q.required) {
          fieldSchema = schema.min(1, "Campo obrigatório");
        } else {
          fieldSchema = schema.optional().or(z.literal(""));
        }
        break;
      }
      case "cnpj": {
        let schema = z.string().regex(/^\d{14}$/, "CNPJ inválido");
        if (q.required) {
          fieldSchema = schema.min(1, "Campo obrigatório");
        } else {
          fieldSchema = schema.optional().or(z.literal(""));
        }
        break;
      }
      case "number_input": {
        let schema = z.coerce.number("Por favor, insira um número válido.");
        if (q.required) {
          fieldSchema = schema.refine((val) => val != null, {
            message: "Campo obrigatório",
          });
        } else {
          fieldSchema = schema.optional();
        }
        break;
      }
//... (rest of the code)
      case "date_picker": {
        let schema = z.date("Por favor, insira uma data válida.");
        if (q.required) {
          fieldSchema = schema.refine((date) => date != null, {
            message: "Campo obrigatório",
          });
        } else {
          fieldSchema = schema.optional().nullable();
        }
        break;
      }
      case "switch":
        fieldSchema = z.boolean().default(false);
        break;
      case "slider":
        fieldSchema = z.number().min(q.min).max(q.max);
        break;
      default:
        fieldSchema = z.any();
    }

    acc[q.id] = fieldSchema;
    return acc;
  }, {} as Record<string, z.ZodTypeAny>);

  return z.object(schemaObject);
}
