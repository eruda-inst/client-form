"use client";

import { useEffect, useState } from "react";
import { FormDefinition } from "@/lib/types";
import { mapApiFormToFormDefinition } from "@/lib/utils";

export function useFormData(slug: string) {
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

  return { formDef, loading, error };
}
