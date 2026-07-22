import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface MessageOptions {
  from: string;
  subject: string;
  html?: string;
  text?: string;
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipient?: string;
}

async function sendSingleEmail(to: string, options: MessageOptions): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from,
      to: [to],
      subject: options.subject,
      html: options.html,
      text: options.text as string,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        recipient: to,
      };
    }

    return {
      success: true,
      messageId: data?.id,
      recipient: to,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      recipient: to,
    };
  }
}

async function sendMassMessages(
  recipients: string[],
  options: MessageOptions,
): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: SendResult[];
}> {
  const limitedRecipients = recipients.slice(0, 1000);
  const results: SendResult[] = [];

  // Resend allows up to 100 recipients per batch
  const BATCH_SIZE = 100;

  for (let i = 0; i < limitedRecipients.length; i += BATCH_SIZE) {
    const batch = limitedRecipients.slice(i, i + BATCH_SIZE);

    try {
      // Send batch via Resend
      const { data, error } = await resend.emails.send({
        from: options.from,
        to: batch,
        subject: options.subject,
        html: options.html,
        text: options.text as string,
      });

      if (error) {
        batch.forEach((recipient) => {
          results.push({
            success: false,
            error: error.message,
            recipient,
          });
        });
      } else {
        batch.forEach((recipient) => {
          results.push({
            success: true,
            messageId: data?.id,
            recipient,
          });
        });
      }
    } catch (error) {
      batch.forEach((recipient) => {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          recipient,
        });
      });
    }
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    total: results.length,
    successful,
    failed,
    results,
  };
}

/**
 * Alternative: Send individual emails (slower but more granular error handling)
 * Useful if you need per-recipient tracking
 */
async function sendMassMessagesIndividual(
  recipients: string[],
  options: MessageOptions,
): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: SendResult[];
}> {
  const limitedRecipients = recipients.slice(0, 1000);
  const results: SendResult[] = [];

  // Send each email individually
  for (const recipient of limitedRecipients) {
    const result = await sendSingleEmail(recipient, options);
    results.push(result);
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  return {
    total: results.length,
    successful,
    failed,
    results,
  };
}

// Export for use in your application
export {
  sendSingleEmail,
  sendMassMessages,
  sendMassMessagesIndividual,
  type MessageOptions,
  type SendResult,
};
