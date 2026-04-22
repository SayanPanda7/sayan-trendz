import nodemailer from 'nodemailer';
import { env } from './env.js';

export const mailTransporter =
  env.mail.host && env.mail.user && env.mail.pass
    ? nodemailer.createTransport({
        host: env.mail.host,
        port: env.mail.port,
        secure: env.mail.secure,
        auth: {
          user: env.mail.user,
          pass: env.mail.pass,
        },
      })
    : null;
