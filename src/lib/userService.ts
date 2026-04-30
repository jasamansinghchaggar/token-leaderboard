export interface UserRegistrationPayload {
  publicKey: string;
  walletName: string;
}

interface UserRegistrationResponse {
  success: boolean;
  error?: string;
}

export async function registerUser(
  payload: UserRegistrationPayload
): Promise<{ success: boolean; message: string }> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as UserRegistrationResponse;
  if (!response.ok) {
    throw new Error(data.error || "Failed to register user");
  }

  return {
    success: true,
    message: `User ${payload.walletName} registered successfully`,
  };
}
