interface SendEmailPayload {
  to: string;
  subject: string;
}

interface SendEmailResponse {
  success: boolean;
  message: string;
}

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

/**
 * Send an email notification using the API
 */
export const sendEmail = async (
  payload: SendEmailPayload
): Promise<SendEmailResponse> => {
  try {
    console.log(
      `Sending email to ${payload.to} with subject: ${payload.subject}`
    );

    const response = await fetch(
      `https://urgent-2kay-directed-bill-payment-system-rss6.onrender.com/api/email/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Email sending failed:", data.message || "Unknown error");
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully");
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Email sending failed";
    console.error("Email service error:", errorMessage);
    throw error;
  }
};

/**
 * Send bundle summary email to the sponsor
 * Only the sponsor will receive the email as the primary recipient
 */
export const sendBundleSummaryEmail = async (
  sponsorEmail: string | undefined,
  sponsorName: string,
  bundleTitle: string
): Promise<void> => {
  // Send email to the sponsor if available (PRIMARY RECIPIENT)
  if (sponsorEmail) {
    console.log(`Sending payment request email to sponsor: ${sponsorEmail}`);
    await sendEmail({
      to: sponsorEmail,
      subject: `URGENT 2KAY: New Payment Request - "${bundleTitle}"`,
    });
  } else {
    console.warn("No sponsor email provided, skipping notification");
  }
};
