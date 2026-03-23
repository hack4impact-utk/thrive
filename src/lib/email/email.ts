import { brevo } from "./brevo";

export async function addUserToWelcomeFlow(email: string, firstName?: string) {
  return brevo.contacts.createContact({
    email,
    attributes: {
      FIRSTNAME: firstName || undefined,
    },
    listIds: [2],
    updateEnabled: true,
  });
}

/**
 * Fires a Brevo custom event when a user signs up for an event.
 * Use this with a Brevo automation that triggers on "event_signup"
 * and sends a reminder email 24 hours before the event date.
 */
export async function sendEventSignupEvent({
  email,
  firstName,
  eventTitle,
  eventDate,
  startTime,
  eventId,
}: {
  email: string;
  firstName?: string;
  eventTitle: string;
  eventDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM:SS"
  eventId: string;
}) {
  const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY");
  }

  const res = await fetch("https://api.brevo.com/v3/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      event_name: "event_signup",
      identifiers: {
        email_id: email,
      },
      contact_properties: {
        FIRSTNAME: firstName || undefined,
      },
      event_properties: {
        event_title: eventTitle,
        event_date: eventDate,
        start_time: startTime,
        event_id: eventId,
      },
      event_date: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Brevo event_signup error:", res.status, text);
    throw new Error(`Brevo event API error ${res.status}`);
  }
}

/**
 * Fires a Brevo custom event to trigger an immediate reminder email.
 * Called by the daily cron job for events happening in the next 24 hours.
 */
export async function sendEventReminderEvent({
  email,
  firstName,
  eventTitle,
  eventDate,
  startTime,
  eventId,
}: {
  email: string;
  firstName?: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  eventId: string;
}) {
  const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY");
  }

  const res = await fetch("https://api.brevo.com/v3/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      event_name: "event_reminder",
      identifiers: {
        email_id: email,
      },
      contact_properties: {
        FIRSTNAME: firstName || undefined,
      },
      event_properties: {
        event_title: eventTitle,
        event_date: eventDate,
        start_time: startTime,
        event_id: eventId,
      },
      event_date: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Brevo event_reminder error:", res.status, text);
    throw new Error(`Brevo event API error ${res.status}`);
  }
}