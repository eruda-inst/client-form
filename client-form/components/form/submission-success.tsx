"use client";

import { PartyPopper } from "lucide-react";
import Image from "next/image";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function SubmissionSuccess() {
  return (
<Alert className="m-0 flex flex-col items-center space-y-1 text-center">
     
        <div className="flex flex-row items-center space-x-2 text-center">
      <PartyPopper className="h-10 w-10 text-green-400" />
      <AlertTitle className="text-4xl w-fit font-bold overflow-visible">
        Obrigado!</AlertTitle>
        </div>
      <AlertDescription className="text-2xl">
        Sua opinião é muito importante para nós.
      </AlertDescription>
      <Image
                      src="/success.png"
                      width={500}
                      height={400}
                      alt="Success Image"
                    />
    </Alert>
  );
}
