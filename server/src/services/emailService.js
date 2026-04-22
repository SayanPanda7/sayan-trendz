import { env } from '../config/env.js';
import { mailTransporter } from '../config/mailer.js';

export async function sendTransactionalEmail({ to, subject, html }) {
  if (!mailTransporter || !to) {
    return { delivered: false, skipped: true };
  }

  await mailTransporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    html,
  });

  return { delivered: true };
}

export async function sendOrderConfirmationEmail({ order, user }) {
  const itemsHtml = order.items
    .map((item) => `<li>${item.title} x ${item.quantity} - Rs. ${item.totalPrice}</li>`)
    .join('');

  return sendTransactionalEmail({
    to: user.email,
    subject: `Sayan Trendz Order Confirmed - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #271c16;">
        <h2>Your Sayan Trendz order is confirmed</h2>
        <p>Thank you for shopping with us. Your order <strong>${order.orderNumber}</strong> has been placed successfully.</p>
        <ul>${itemsHtml}</ul>
        <p>Total Paid: <strong>Rs. ${order.total}</strong></p>
      </div>
    `,
  });
}

export async function sendOrderStatusEmail({ order, user }) {
  return sendTransactionalEmail({
    to: user.email,
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #271c16;">
        <h2>Your order status has been updated</h2>
        <p>Order <strong>${order.orderNumber}</strong> is now <strong>${order.status}</strong>.</p>
      </div>
    `,
  });
}
