import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const count = parseInt(searchParams.get("count") || "10");

    try {
        const clients = [];
        for (let i = 0; i < count; i++) {
            const client = await prisma.client.create({
                data: {
                    name: `Client ${Math.floor(Math.random() * 10000)}`,
                    email: `client${Math.floor(Math.random() * 10000)}@example.com`,
                    createdAt: new Date(),
                }
            });
            clients.push(client);
        }

        for (const client of clients) {
            // Create Quote
            await prisma.quote.create({
                data: {
                    number: `Q-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    clientId: client.id,
                    date: new Date(),
                    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    status: "DRAFT",
                    total: 1000,
                    items: {
                        create: [{
                            title: "Seeded Service",
                            description: "Auto-generated seed item",
                            quantity: 1,
                            price: 1000,
                            total: 1000
                        }]
                    }
                }
            });

            // Create Invoice
            await prisma.invoice.create({
                data: {
                    number: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    clientId: client.id,
                    date: new Date(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    status: "DRAFT",
                    total: 1500,
                    items: {
                        create: [{
                            title: "Seeded Project",
                            description: "Auto-generated seed invoice item",
                            quantity: 1,
                            price: 1500,
                            total: 1500
                        }]
                    }
                }
            });
        }

        return NextResponse.json({ success: true, count });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
