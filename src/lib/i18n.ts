import "server-only";
import { cookies } from "next/headers";
import { fr, en, type Dictionary } from "./dictionaries";
import { prisma } from "./prisma";

export async function getDictionary(): Promise<{ dict: Dictionary; lang: "fr" | "en" }> {
    try {
        const cookieStore = await cookies();
        let locale: string | undefined;

        // Check database first as it's the source of truth for the organization
        const org = await prisma.organization.findFirst();
        if (org?.language) {
            locale = org.language;
        }

        // Fallback to cookie
        if (!locale) {
            locale = cookieStore.get("NEXT_LOCALE")?.value;
        }

        if (locale === "en") {
            return { dict: en, lang: "en" };
        }
        return { dict: fr, lang: "fr" };
    } catch (error) {
        // Fallback for static generation if needed, though most pages are dynamic
        return { dict: fr, lang: "fr" };
    }
}
