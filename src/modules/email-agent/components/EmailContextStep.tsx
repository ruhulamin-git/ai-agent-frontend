"use client";

import { useEffect, useState } from "react";

import { useEmailContext, useUpdateContext } from "@/modules/email-agent";
import { CustomTextArea } from "@/shared/form-elements/CustomTextArea";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";

export const EmailContextStep = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const { data: initialContext, isLoading } = useEmailContext();
  const { mutate: updateContext, isPending } = useUpdateContext();

  const [context, setContext] = useState("");

  useEffect(() => {
    if (initialContext) {
      setContext(initialContext);
    }
  }, [initialContext]);

  const handleNext = () => {
    updateContext(context, {
      onSuccess: () => {
        onNext();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Context</CardTitle>
        <CardDescription>
          Provide the context or instructions for the AI to generate/send the email.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <CustomTextArea
            placeholder="E.g., Send a follow-up email to the client about the project proposal..."
            className="min-h-[200px] resize-y"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={!context.trim() || isPending}>
            {isPending ? "Saving..." : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
