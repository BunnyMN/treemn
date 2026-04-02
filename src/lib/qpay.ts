const QPAY_API = process.env.QPAY_API_URL || "https://merchant.qpay.mn/v2";

let tokenCache: { token: string; refreshToken: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  // Return cached token if still valid
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  // Try refresh if we have a refresh token
  if (tokenCache?.refreshToken) {
    try {
      const res = await fetch(`${QPAY_API}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenCache.refreshToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        tokenCache = {
          token: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + (data.expires_in - 60) * 1000,
        };
        return data.access_token;
      }
    } catch {
      // Fall through to fresh auth
    }
  }

  // Fresh auth
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QPay auth failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    refreshToken: data.refresh_token,
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

  const body = {
    invoice_code: params.invoiceCode,
    sender_invoice_no: params.senderCode,
    invoice_receiver_code: "terminal",
    invoice_description: params.description,
    amount: params.amount,
    callback_url: params.callbackUrl,
  };

  console.log("QPay invoice request:", JSON.stringify(body));

  const res = await fetch(`${QPAY_API}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("QPay invoice error:", res.status, err);
    throw new Error(`QPay invoice failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  console.log("QPay invoice response keys:", Object.keys(data));
  return data;
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
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QPay check failed: ${err}`);
  }

  return res.json();
}
