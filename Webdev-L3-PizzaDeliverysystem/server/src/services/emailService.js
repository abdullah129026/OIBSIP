import { transporter } from '../config/mailer.js';

const FROM = 'PizzaCrave <no-reply@pizzacrave.test>';
const BRAND = '#FF9800';

const shell = (heading, body) => `
  <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #FBF6EC; padding: 32px; border-radius: 14px; color: #2B2B2B;">
    <h1 style="color: ${BRAND}; margin: 0 0 16px;">PizzaCrave</h1>
    <h2 style="margin: 0 0 12px;">${heading}</h2>
    ${body}
    <p style="color: #6B6B6B; font-size: 13px; margin-top: 24px;">est. 2024 · Fresh, hot, and delicious · delivered to your door!</p>
  </div>
`;

const button = (href, label) => `
  <a href="${href}" style="display: inline-block; background: ${BRAND}; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 28px; font-weight: 600;">${label}</a>
`;

const send = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[email/send]', err.message);
  }
};

export const sendVerifyEmail = async (to, rawToken) => {
  const link = `${process.env.CLIENT_URL}/verify/${rawToken}`;
  await send(
    to,
    'Verify your PizzaCrave account',
    shell(
      'Confirm your email',
      `<p>Tap below to verify your account and start ordering. This link expires in 24 hours.</p>
       <p style="margin: 24px 0;">${button(link, 'Verify Email')}</p>`
    )
  );
};

export const sendResetEmail = async (to, rawToken) => {
  const link = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await send(
    to,
    'Reset your PizzaCrave password',
    shell(
      'Reset your password',
      `<p>We received a request to reset your password. This link expires in 1 hour. If you didn't ask for this, ignore this email.</p>
       <p style="margin: 24px 0;">${button(link, 'Reset Password')}</p>`
    )
  );
};

export const sendLowStockEmail = async (to, items) => {
  const rows = items
    .map(
      (i) =>
        `<li><strong>${i.name}</strong> (${i.type}) — ${i.stock} ${i.unit} left (threshold ${i.threshold})</li>`
    )
    .join('');
  await send(
    to,
    'PizzaCrave — low stock alert',
    shell(
      'Low stock alert',
      `<p>The following items are below their threshold and need restocking:</p>
       <ul>${rows}</ul>`
    )
  );
};
