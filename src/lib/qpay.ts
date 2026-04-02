const QPAY_API = process.env.QPAY_API_URL || "https://merchant.qpay.mn/v2";

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const res = await fetch(`${QPAY_API}/auth/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`
        ).toString("base64"),
    },
  });

  if (!res.ok) throw new Error("QPay auth failed");

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

export async function createInvoice(params: {
  invoiceCode: string;
  senderCode: string;
  amount: number;
  description: string;
  callbackUrl: string;
}) {
  const token = await getToken();

  const res = await fetch(`${QPAY_API}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice_code: params.invoiceCode,
      sender_invoice_no: params.senderCode,
      invoice_receiver_code: params.senderCode,
      amount: params.amount,
      invoice_description: params.description,
      callback_url: params.callbackUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QPay invoice failed: ${err}`);
  }

  return res.json();
}

export async function checkPayment(invoiceId: string) {
  const token = await getToken();

  const res = await fetch(`${QPAY_API}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
    }),
  });

  if (!res.ok) throw new Error("QPay check failed");

  return res.json();
}
