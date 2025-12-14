import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const paymentId = body?.data?.id || body?.id;

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
  }

  try {
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    console.log(
      `Webhook recebido: Pagamento ${paymentId} está ${paymentInfo.status}`
    );

    if (paymentInfo.status === "approved") {
      const userId = paymentInfo.external_reference;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            planStatus: "LIFETIME",
          },
        });

        await prisma.payment
          .create({
            data: {
              externalId: String(paymentId),
              amount: paymentInfo.transaction_amount || 0,
              status: "APPROVED",
              userId: userId,
            },
          })
          .catch((e) => {
            console.log("Pagamento já registrado ou erro de log:", e);
          });

        console.log(`Usuário ${userId} atualizado para LIFETIME!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no Webhook:", error);

    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
