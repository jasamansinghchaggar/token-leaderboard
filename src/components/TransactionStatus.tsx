"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

export function TransactionStatus() {
  const { transactionStatus } = useAppStore();

  if (!transactionStatus) {
    return null;
  }

  const variants = {
    pending: {
      icon: <Clock className="h-4 w-4" />,
      title: "Transaction Pending",
      color: "border-blue-200 bg-blue-50",
    },
    success: {
      icon: <CheckCircle className="h-4 w-4" />,
      title: "Transaction Successful",
      color: "border-green-200 bg-green-50",
    },
    failed: {
      icon: <AlertCircle className="h-4 w-4" />,
      title: "Transaction Failed",
      color: "border-red-200 bg-red-50",
    },
  } as const;

  const variant = variants[transactionStatus.status];

  return (
    <Alert className={variant.color}>
      {variant.icon}
      <AlertTitle>{variant.title}</AlertTitle>
      <AlertDescription className="text-xs">
        <span className="font-mono">Hash: {transactionStatus.hash}</span>
        {transactionStatus.error ? (
          <p className="mt-1 text-destructive">{transactionStatus.error}</p>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
