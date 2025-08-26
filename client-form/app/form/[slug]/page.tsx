"use client";

import { useParams } from "next/navigation";
import { useFormData } from "@/hooks/use-form-data";
import { DynamicForm } from "@/components/form/dynamic-form";

export default function FormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { formDef, loading, error } = useFormData(slug);

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
