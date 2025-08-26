"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormDefinition,
  Question,
  OptionsQuestion,
  NPSQuestion,
  TextInputQuestion,
  SliderQuestion,
  SwitchQuestion,
  DatePickerQuestion,
} from "@/lib/types";
import { mapApiFormToFormDefinition } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";


// Helper to create the Zod schema from the form definition
function createFormSchema(questions: Question[]) {
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
          fieldSchema = schema.optional();
        }
        break;
      }
      case "number_input": {
        let schema = z.coerce.number();
        if (q.required) {
          fieldSchema = schema.refine((val) => val != null, {
            message: "Campo obrigatório",
          });
        } else {
          fieldSchema = schema.optional();
        }
        break;
      }
      case "checkbox_group": {
        let schema = z.array(z.string());
        if (q.required) {
          fieldSchema = schema.min(1, "Selecione ao menos uma opção");
        } else {
          fieldSchema = schema.default([]);
        }
        break;
      }
      case "nps":
        fieldSchema = z.number().min(q.min).max(q.max);
        break;
      case "date_picker": {
        let schema = z.date();
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

// A dedicated component to render each question
const RenderQuestion = ({
  question,
  control,
}: {
  question: Question;
  control: any;
}) => {
  return (
    <FormField
      control={control}
      name={question.id}
      render={({ field }) => {
        switch (question.type) {
          case "text_input":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input placeholder={question.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          case "textarea_input":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Textarea placeholder={question.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          case "number_input":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={question.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          case "radio":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid gap-3"
                  >
                    {question.options.map((option) => (
                      <Label
                        key={option.value}
                        className="hover:bg-accent/50  flex items-start gap-3 rounded-lg border p-3 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950"
                      >
                        <FormControl>
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                        </FormControl>
                        <div className="grid gap-1.5 font-normal">
                          <p className="text-sm leading-none font-medium">
                            {option.label}
                          </p>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          case "checkbox_group":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                {question.options.map((option) => (
                  <FormField
                    key={option.value}
                    control={control}
                    name={question.id}
                    render={({ field }) => {
                      const fieldValue = field.value || [];
                      return (
                        <FormItem
                          key={option.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={fieldValue.includes(option.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...fieldValue,
                                    option.value,
                                  ]);
                                } else {
                                  field.onChange(
                                    fieldValue.filter(
                                      (value: string) => value !== option.value
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            );
          case "nps": {
            const npsQuestion = question as NPSQuestion;
            const npsOptions = Array.from(
              { length: npsQuestion.max - npsQuestion.min + 1 },
              (_, i) => npsQuestion.min + i
            );
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  {npsOptions.length > 15 ? (
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                      min={npsQuestion.min}
                      max={npsQuestion.max}
                    />
                  ) : (
                    <RadioGroup
                      onValueChange={(value) =>
                        field.onChange(parseInt(value, 10))
                      }
                      value={field.value?.toString()}
                      className="flex flex-wrap justify-center gap-1"
                    >
                      {npsOptions.map((value) => (
                        <Label
                          key={value}
                          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border p-3 hover:bg-accent/50 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={value.toString()}
                              id={value.toString()}
                              className="sr-only"
                            />
                          </FormControl>
                          <span className="text-base font-medium">{value}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }
          case "date_picker":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={question.placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          case "switch":
            return (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{question.label}</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            );
          case "slider":
            return (
              <FormItem>
                <FormLabel>{question.label}</FormLabel>
                <FormControl>
                  <Slider
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    min={question.min}
                    max={question.max}
                    step={question.step}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          default:
            return <></>;
        }
      }}
    />
  );
};

function DynamicForm({
  formDef,
  slug,
}: {
  formDef: FormDefinition;
  slug: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formSchema = createFormSchema(formDef.questions);

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
      // Optionally, show a success message or redirect
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
      {isDesktop ? (
        <Card>
          <FormContent />
        </Card>
      ) : (
        <FormContent />
      )}
    </div>
  );
}

export default function FormPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [formDef, setFormDef] = useState<FormDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchForm = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/formularios/publico/${slug}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setError("Formulário não encontrado.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const rawData: any = await response.json(); // You might want to define a type for the raw API response
          if (rawData) {
            const mappedForm = mapApiFormToFormDefinition(rawData);
            setFormDef(mappedForm);
          } else {
            setError("Formulário não encontrado.");
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando formulário...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Erro: {error}
      </div>
    );
  }

  if (!formDef) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Formulário não disponível.
      </div>
    );
  }

  return <DynamicForm formDef={formDef} slug={slug} />;
}