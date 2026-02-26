---
name: Contact Form
description: Build a reusable contact/inquiry form with email delivery (Resend, EmailJS, or Formspree), spam protection, validation, and success feedback. Works with any website.
---

# Contact Form Skill

## Overview
This skill enables you to build a **production-ready contact form** that sends inquiry emails. Covers validation, spam prevention, email delivery, and user feedback. Works with static sites, Next.js, or any web framework.

## Options for Email Delivery

| Service | Free Tier | Server Required? | Best For |
|---------|-----------|-------------------|----------|
| **Formspree** | 50 submissions/mo | ❌ No | Static HTML sites (simplest) |
| **EmailJS** | 200 emails/mo | ❌ No | Static sites with more control |
| **Resend** | 3,000 emails/mo | ✅ Yes (API route) | Next.js / full-stack apps |
| **Netlify Forms** | 100 submissions/mo | ❌ No | Netlify-hosted sites |

## Option 1: Formspree (Simplest - No Server)

Zero-backend contact form. Just HTML.

### Setup
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form → Get form endpoint URL
3. Paste into HTML `action` attribute

### Implementation
```html
<form id="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
  <div class="form-group">
    <label for="name">Name / お名前 *</label>
    <input type="text" id="name" name="name" required placeholder="Your name" />
  </div>

  <div class="form-group">
    <label for="email">Email / メール *</label>
    <input type="email" id="email" name="email" required placeholder="your@email.com" />
  </div>

  <div class="form-group">
    <label for="phone">Phone / 電話</label>
    <input type="tel" id="phone" name="phone" placeholder="+61 4XX XXX XXX" />
  </div>

  <div class="form-group">
    <label for="message">Message / お問い合わせ内容 *</label>
    <textarea id="message" name="message" required rows="5" placeholder="How can we help?"></textarea>
  </div>

  <!-- Honeypot spam protection (hidden from humans) -->
  <input type="text" name="_gotcha" style="display:none" />

  <!-- Custom redirect after submission -->
  <input type="hidden" name="_next" value="https://yourdomain.com/thank-you" />

  <button type="submit">Send / 送信</button>
</form>
```

### Enhanced with JavaScript (AJAX submission)
```html
<script>
  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.innerHTML = `
          <div class="success-message">
            <h3>✓ Message Sent!</h3>
            <p>Thank you for your inquiry. We'll get back to you within 24 hours.</p>
            <p>お問い合わせありがとうございます。24時間以内にご返信いたします。</p>
          </div>
        `;
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      btn.textContent = originalText;
      btn.disabled = false;
      alert('Failed to send. Please try again or contact us directly.');
    }
  });
</script>
```

## Option 2: EmailJS (No Server, More Control)

### Setup
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get: Service ID, Template ID, Public Key

### Implementation
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
  emailjs.init('YOUR_PUBLIC_KEY');

  document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target);
      // Show success message
    } catch (error) {
      // Show error message
    }
  });
</script>
```

## Option 3: Resend (Server Required - Next.js)

### `app/api/contact/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send to business owner
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: 'owner@yourdomain.com',
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
      replyTo: email,
    });

    // Auto-reply to customer
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Thank you for your inquiry / お問い合わせありがとうございます',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting us. We have received your message and will get back to you within 24 hours.</p>
        <br />
        <p>${name}様</p>
        <p>お問い合わせいただきありがとうございます。内容を確認の上、24時間以内にご返信いたします。</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## Form Styling

```css
.contact-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: var(--color-background, #fff);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #aaa;
}

/* Submit button */
.contact-form button[type="submit"] {
  width: 100%;
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.contact-form button[type="submit"]:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.contact-form button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Success message */
.success-message {
  text-align: center;
  padding: 2rem;
  background: #f0fdf4;
  border-radius: 12px;
  border: 1px solid #86efac;
}

.success-message h3 {
  color: #16a34a;
  margin-bottom: 0.5rem;
}
```

## Spam Protection

### 1. Honeypot Field (Recommended - All Approaches)
```html
<!-- Hidden from humans, bots fill it in -->
<div style="position: absolute; left: -9999px;">
  <input type="text" name="website" tabindex="-1" autocomplete="off" />
</div>
```
Server-side: reject if `website` field has a value.

### 2. Rate Limiting (Server-side)
```typescript
// Simple in-memory rate limit
const submissions = new Map<string, number[]>();
const RATE_LIMIT = 3; // max submissions
const WINDOW = 60 * 60 * 1000; // per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = submissions.get(ip) || [];
  const recent = history.filter(t => now - t < WINDOW);
  submissions.set(ip, recent);
  return recent.length >= RATE_LIMIT;
}
```

### 3. reCAPTCHA v3 (If spam is persistent)
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
<script>
  grecaptcha.ready(function() {
    grecaptcha.execute('YOUR_SITE_KEY', {action: 'contact'}).then(function(token) {
      document.getElementById('recaptcha-token').value = token;
    });
  });
</script>
<input type="hidden" id="recaptcha-token" name="recaptcha_token" />
```

## Implementation Checklist
- [ ] Choose email delivery service (Formspree / EmailJS / Resend)
- [ ] Create form HTML with proper labels and validation
- [ ] Add honeypot spam protection
- [ ] Implement AJAX submission with loading state
- [ ] Add success/error feedback UI
- [ ] Style the form to match site design
- [ ] Test submission and email delivery
- [ ] (Optional) Add auto-reply to customer
- [ ] (Optional) Add reCAPTCHA if spam is an issue

## Usage Instructions for Antigravity

1. **For static sites**: Use Formspree (simplest) or EmailJS
2. **For Next.js sites**: Use Resend with API route
3. **Always include**: honeypot field, validation, loading state, success message
4. **Style to match**: the project's design system (colors, typography, spacing)
5. **Bilingual labels**: if using i18n skill, provide labels in both languages

---

This skill provides a complete, reusable contact form system for any website.
