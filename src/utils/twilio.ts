const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';
const token: string = process.env.TWILIO_AUTH_TOKEN || '';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const twilioClient = require('twilio')(accountSid, token);
