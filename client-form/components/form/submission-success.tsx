"use client";

import { CheckCircle2Icon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function SubmissionSuccess() {
  return (
    <Alert className="m-0">
      <CheckCircle2Icon className="h-5 w-5" />
      <AlertTitle className="">Sucesso!</AlertTitle>
      <AlertDescription>
        Seu formulário foi enviado com sucesso.
      </AlertDescription>
    </Alert>
  );
}
