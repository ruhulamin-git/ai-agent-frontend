"use client";

import { toast } from "sonner";

import { useEmailContext, useSendEmail } from "@/modules/email-agent";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";

export const SendEmailStep = ({ accountId, onBack }: { accountId: string; onBack: () => void }) => {
  const { data: context, isLoading: isContextLoading } = useEmailContext();
  const { mutate: sendEmail, isPending: isSending } = useSendEmail();

  const handleSend = () => {
    if (!context) return;
    sendEmail(
      { accountId, context },
      {
        onSuccess: () => {
          toast.success("Email sent successfully!");
        },
        onError: () => {
          toast.error("Failed to send email.");
        },
      }
    );
  };

  if (isContextLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Send</CardTitle>
        <CardDescription>
          Ready to send email from account ID <span className="font-mono text-xs">{accountId}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Context:</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{context}</p>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isSending}>
            Back
          </Button>
          <Button onClick={handleSend} disabled={isSending} className="w-32">
            {isSending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Sending...
              </>
            ) : (
              "Send Email"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
