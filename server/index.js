import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { appendFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ── Contact Submission Log ─────────────────────────────────
const logDir = join(__dirname, 'data')
const logFile = join(logDir, 'submissions.json')
if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true })
if (!existsSync(logFile)) appendFileSync(logFile, '[]')

// ── Nodemailer Transporter ─────────────────────────────────
// Using Ethereal (fake SMTP) for development. Replace with your real SMTP in production.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass',
  },
})

// ── POST /api/contact ──────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  const submission = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || null,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  }

  // 1. Log to file
  try {
    const { readFileSync, writeFileSync } = await import('fs')
    const raw = existsSync(logFile)
      ? JSON.parse(readFileSync(logFile, 'utf-8') || '[]')
      : []
    raw.push(submission)
    writeFileSync(logFile, JSON.stringify(raw, null, 2))
  } catch (fileErr) {
    console.error('Could not write submission log:', fileErr.message)
  }

  // 2. Send notification email (fire-and-forget in dev)
  try {
    await transporter.sendMail({
      from: `"Ember & Oak Website" <no-reply@emberandoak.coffee>`,
      to: process.env.NOTIFY_EMAIL || 'hello@emberandoak.coffee',
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        `\nMessage:\n${message}`,
        `\nSubmitted: ${submission.timestamp}`,
      ].filter(Boolean).join('\n'),
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#23190F;">
          <h2 style="color:#C05A34;font-weight:500;margin-bottom:4px;">New Contact Submission</h2>
          <p style="color:#5E6347;font-size:13px;margin-top:0;">Ember &amp; Oak Website</p>
          <hr style="border:none;border-top:1px solid #EBE0CD;margin:20px 0;" />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p style="margin-top:16px;"><strong>Message:</strong></p>
          <p style="background:#F4ECDD;padding:16px;border-radius:4px;line-height:1.7;">${message.replace(/\n/g, '<br />')}</p>
          <p style="color:#5E6347;font-size:12px;margin-top:24px;">Submitted at ${submission.timestamp}</p>
        </div>
      `,
    })
  } catch (mailErr) {
    console.warn('Email send failed (non-critical):', mailErr.message)
  }

  res.status(200).json({ ok: true, message: 'Submission received.' })
})

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'origen-cafe-api' }))

app.listen(PORT, () => {
  console.log(`🚀 Ember & Oak API running on http://localhost:${PORT}`)
  console.log(`   POST /api/contact — form submissions`)
  console.log(`   GET  /api/health  — health check`)
})
