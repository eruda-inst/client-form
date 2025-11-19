import { Metadata } from "next";
import { DynamicForm } from "@/components/form/dynamic-form";
import { mapApiFormToFormDefinition } from "@/lib/utils";
import { FormDefinition } from "@/lib/types";

type Props = {
  params: { 
    slug: string,
    mode: string
   };
};

// Function to fetch form data
async function getForm(slug: string): Promise<FormDefinition | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/formularios/publico/${slug}`
    );
    if (!response.ok) {
      return null;
    }
    const rawData: any = await response.json();
    if (rawData) {
      console.log(rawData);
      return mapApiFormToFormDefinition(rawData);
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch form data:", error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug, mode} = params;
  const form = await getForm(slug);

  if (!form) {
    return {
      title: "Formulário não encontrado",
      description: "O formulário que você está procurando não existe ou não está disponível.",
    };
  }

  return {
    title: form.titulo,
    description: form.descricao,
  };
}

// The page component
export default async function FormPage({ params }: Props) {
  const slug = params.slug;
  const mode = params.mode;
  const formDef = await getForm(slug);

  if (!formDef) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Formulário não disponível.
      </div>
    );
  }

  return <DynamicForm formDef={formDef} slug={slug} mode={mode} />;
}