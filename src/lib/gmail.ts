// Configuration Gmail API
export const GMAIL_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  scopes: [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
  ],
};

// Types pour les emails
export interface EmailData {
  to: string[];
  subject: string;
  body: string;
  from?: string;
}

// Fonction pour créer le message email au format RFC 2822
export function createEmailMessage(emailData: EmailData): string {
  const { to, subject, body, from = 'me' } = emailData;
  
  const email = [
    `From: ${from}`,
    `To: ${to.join(', ')}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body,
  ].join('\r\n');

  // Encoder en base64url
  return btoa(email)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Fonction pour envoyer un email via Gmail API
export async function sendEmailViaGmail(
  accessToken: string,
  emailData: EmailData
): Promise<Response> {
  const encodedMessage = createEmailMessage(emailData);

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    }
  );

  return response;
}
