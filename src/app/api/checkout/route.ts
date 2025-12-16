import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: "plano-pro",
            title: "BioLinks Pro (3 meses)",
            quantity: 1,
            unit_price: 49.9,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: dbUser.email,
        },
        external_reference: dbUser.id,
        metadata: {
          user_id: dbUser.id,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?pending=true`,
        },
        auto_return: "approved",

        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({ url: result.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar pagamento" },
      { status: 500 }
    );
  }
}
