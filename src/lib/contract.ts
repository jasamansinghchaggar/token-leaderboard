import {
  Address,
  Contract,
  TimeoutInfinite,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToBigInt,
  xdr,
} from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL!;
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!;
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID!;

const server = new rpc.Server(RPC_URL, {
  allowHttp: RPC_URL.startsWith("http://"),
});

export interface ContractCallResult {
  txHash: string;
  status: "pending" | "success" | "failed";
}

export async function callUpdateBalance(
  publicKey: string,
  balance: bigint,
  signedXdr: string
): Promise<ContractCallResult> {
  const account = await server.getAccount(publicKey);
  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "update_balance",
        Address.fromString(publicKey).toScVal(),
        nativeToScVal(balance, { type: "u128" })
      )
    )
    .setTimeout(TimeoutInfinite)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  const transactionToSubmit = TransactionBuilder.fromXDR(
    signedXdr || preparedTx.toXDR(),
    NETWORK_PASSPHRASE
  );

  const submission = await server.sendTransaction(transactionToSubmit);

  if (submission.status === "ERROR") {
    throw new Error("Contract transaction submission failed");
  }

  if (submission.status === "TRY_AGAIN_LATER") {
    return {
      txHash: submission.hash,
      status: "pending",
    };
  }

  const txResult = await server.pollTransaction(submission.hash, { attempts: 10 });

  if (txResult.status === "SUCCESS") {
    return {
      txHash: submission.hash,
      status: "success",
    };
  }

  if (txResult.status === "FAILED") {
    return {
      txHash: submission.hash,
      status: "failed",
    };
  }

  return {
    txHash: submission.hash,
    status: "pending",
  };
}

export async function callGetBalance(address: string): Promise<bigint> {
  try {
    const key = xdr.ScVal.scvVec([
      xdr.ScVal.scvSymbol("balance"),
      Address.fromString(address).toScVal(),
    ]);

    const result = await server.getContractData(CONTRACT_ID, key);
    const contractData = result.val.contractData();

    return scValToBigInt(contractData.val());
  } catch {
    throw new Error("Failed to fetch contract balance");
  }
}
