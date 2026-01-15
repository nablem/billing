"use server";

import { prisma } from "@/lib/prisma";

export async function searchRetainerInvoices(query: string) {
    const retainers = await prisma.invoice.findMany({
        where: {
            isRetainer: true,
            number: {
                contains: query || "",
            },
        },
        orderBy: { createdAt: "desc" },
        take: 15,
        select: { id: true, number: true }
    });
    return retainers;
}

export async function getRetainerDetails(id: string) {
    const retainer = await prisma.invoice.findUnique({
        where: { id },
        include: {
            quote: {
                include: {
                    items: true
                }
            }
        }
    });

    if (!retainer) return null;

    return {
        id: retainer.id,
        number: retainer.number,
        clientId: retainer.clientId,
        total: retainer.total,
        quoteId: retainer.quoteId,
        quoteNumber: retainer.quote?.number,
        items: retainer.quote?.items || []
    };
}
