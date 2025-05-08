
import { FormValues } from "@/types/bundle";

interface SendEmailPayload {
  email: string;
  subject: string;
  text: string;
}

interface SendEmailResponse {
  success: boolean;
  message: string;
}

const API_URL = "https://urgent-2kay-directed-bill-payment-system-rss6.onrender.com";

/**
 * Send an email notification using the API
 */
export const sendEmail = async (payload: SendEmailPayload): Promise<SendEmailResponse> => {
  try {
    console.log(`Sending email to ${payload.email} with subject: ${payload.subject}`);
    
    const response = await fetch(`${API_URL}/api/email/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Email sending failed:", data.message || "Unknown error");
      throw new Error(data.message || "Failed to send email");
    }
    
    console.log("Email sent successfully");
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Email sending failed";
    console.error("Email service error:", errorMessage);
    throw error;
  }
};

/**
 * Generate HTML content for bundle summary email
 */
export const generateBundleSummaryHTML = (
  bundleTitle: string,
  bundleDescription: string,
  sponsorName: string,
  totalAmount: string,
  bills: FormValues[]
): string => {
  // Format the bills list
  const billsHtml = bills.map(bill => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${bill.billName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">₦${bill.amount}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${bill.serviceProvider}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; ${
          bill.priority === 'high' 
            ? 'background-color: #FECACA; color: #B91C1C;' 
            : bill.priority === 'medium'
              ? 'background-color: #FEF3C7; color: #92400E;'
              : 'background-color: #DBEAFE; color: #1E40AF;'
        }">
          ${bill.priority?.toUpperCase()}
        </span>
      </td>
    </tr>
  `).join('');

  // Create the email HTML template
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; padding: 10px 0; background-color: #6544E4; color: white; border-radius: 5px 5px 0 0;">
        <h2 style="margin: 0;">Bundle Summary</h2>
      </div>
      
      <div style="padding: 20px;">
        <h3 style="color: #333; margin-bottom: 5px;">${bundleTitle}</h3>
        <p style="color: #666; margin-bottom: 20px;">${bundleDescription || 'No description provided.'}</p>
        
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; color: #333; margin-bottom: 5px;">Sponsor</p>
          <p style="color: #666;">${sponsorName}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="font-weight: bold; color: #333; margin-bottom: 10px;">Bills</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Name</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Amount</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Provider</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Due Date</th>
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Priority</th>
              </tr>
            </thead>
            <tbody>
              ${billsHtml}
            </tbody>
          </table>
        </div>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; display: flex; justify-content: space-between;">
          <span style="font-weight: bold;">Total Amount</span>
          <span style="font-weight: bold;">₦${totalAmount}</span>
        </div>
      </div>
      
      <div style="padding: 15px; background-color: #f8f8f8; text-align: center; color: #666; border-radius: 0 0 5px 5px; margin-top: 20px;">
        <p style="margin: 0;">This is an automated email from Urgent 2KAY Bill Payment System</p>
      </div>
    </div>
  `;
};

/**
 * Send bundle summary email to both the requestor and sponsor
 * Primary recipient is the sponsor as they need to approve the payment
 */
export const sendBundleSummaryEmail = async (
  requestorEmail: string,
  requestorName: string,
  sponsorEmail: string | undefined,
  sponsorName: string,
  bundleTitle: string,
  bundleDescription: string,
  totalAmount: string,
  bills: FormValues[]
): Promise<void> => {
  const emailHTML = generateBundleSummaryHTML(
    bundleTitle,
    bundleDescription,
    sponsorName,
    totalAmount,
    bills
  );
  
  // Send email to the sponsor if available (PRIMARY RECIPIENT)
  if (sponsorEmail) {
    console.log(`Sending payment request email to sponsor: ${sponsorEmail}`);
    await sendEmail({
      email: sponsorEmail,
      subject: `URGENT 2KAY: New Payment Request from ${requestorName}`,
      text: emailHTML,
    });
  } else {
    console.warn("No sponsor email provided, skipping sponsor notification");
  }
  
  // Also send a confirmation email to the requestor
  console.log(`Sending confirmation email to requestor: ${requestorEmail}`);
  await sendEmail({
    email: requestorEmail,
    subject: `URGENT 2KAY: Your Bundle Request "${bundleTitle}" has been created`,
    text: emailHTML,
  });
};
