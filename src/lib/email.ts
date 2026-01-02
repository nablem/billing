import { type Quote, type Invoice, type Client } from "@prisma/client";
import nodemailer from "nodemailer";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function sendEmail(
    to: { email: string; name: string },
    subject: string,
    content: string,
    attachment?: { filename: string; content: Buffer }
) {
    if (!BREVO_API_KEY) {
        // Use Maildev via Nodemailer
        try {
            const transporter = nodemailer.createTransport({
                host: "localhost",
                port: 1025,
                secure: false, // true for 465, false for other ports
                ignoreTLS: true // Maildev often doesn't care about TLS
            });

            await transporter.sendMail({
                from: `"${process.env.SMTP_FROM_NAME || "Freelance Hub"}" <${process.env.SMTP_FROM_EMAIL || "billing@freelancehub.local"}>`,
                to: `"${to.name}" <${to.email}>`,
                subject: subject,
                html: content,
                attachments: attachment ? [{
                    filename: attachment.filename,
                    content: attachment.content
                }] : undefined
            });

            console.log("Email sent via Maildev to:", to.email);
        } catch (error) {
            console.error("Failed to send email via Maildev:", error);
            // Fallback to console log if Maildev fails
            console.log("Mock Sending Email:", { to, subject, attachment: attachment?.filename });
        }
        return;
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
            "accept": "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: process.env.SMTP_FROM_NAME || "Freelance Hub",
                email: process.env.SMTP_FROM_EMAIL || "billing@freelancehub.local"
            },
            to: [{ email: to.email, name: to.name }],
            subject,
            htmlContent: content,
            attachment: attachment ? [{
                name: attachment.filename,
                content: attachment.content.toString("base64"),
            }] : undefined,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Brevo Error: ${error}`);
    }
}
