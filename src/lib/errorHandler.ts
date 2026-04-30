export type ErrorType =
  | "WALLET_NOT_FOUND"
  | "WALLET_REJECTED"
  | "INSUFFICIENT_BALANCE"
  | "UNKNOWN";

export interface AppError {
  type: ErrorType;
  message: string;
  code: string;
}

export function parseError(error: unknown): AppError {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("WALLET_NOT_FOUND") || message.includes("Wallet not found")) {
    return {
      type: "WALLET_NOT_FOUND",
      message:
        "Selected wallet is not installed or available. Please install and enable the wallet extension.",
      code: "E001",
    };
  }

  if (message.includes("WALLET_REJECTED") || message.toLowerCase().includes("rejected")) {
    return {
      type: "WALLET_REJECTED",
      message: "You rejected the wallet connection request. Please try again.",
      code: "E002",
    };
  }

  if (
    message.toLowerCase().includes("insufficient") ||
    message.toLowerCase().includes("balance")
  ) {
    return {
      type: "INSUFFICIENT_BALANCE",
      message: "Insufficient balance for this transaction.",
      code: "E003",
    };
  }

  return {
    type: "UNKNOWN",
    message: message || "An unexpected error occurred",
    code: "E999",
  };
}

export function displayError(error: AppError): string {
  const messages: Record<ErrorType, string> = {
    WALLET_NOT_FOUND: `[${error.code}] Wallet Not Found: ${error.message}`,
    WALLET_REJECTED: `[${error.code}] Connection Rejected: ${error.message}`,
    INSUFFICIENT_BALANCE: `[${error.code}] Insufficient Funds: ${error.message}`,
    UNKNOWN: `[${error.code}] Error: ${error.message}`,
  };

  return messages[error.type];
}
