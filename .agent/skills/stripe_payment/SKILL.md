---
name: Stripe Payment Integration
description: Integrate Stripe for payment processing, cancellation with refunds, webhook handling, and customer management. Designed to work with the Booking System skill for complete booking + payment flows.
---

# Stripe Payment Integration Skill

## Overview
This skill enables you to integrate **Stripe** for payment processing in any web application. It covers the full payment lifecycle: collecting card info → processing payment → handling refunds/cancellations → managing customers. Designed to pair seamlessly with the **Booking System** skill.

## Why Stripe?

| Feature | Benefit |
|---------|---------|
| **Hosted Checkout** | Stripe handles card input UI (PCI DSS compliant) |
| **Webhooks** | Real-time event notifications (payment success, refund, etc.) |
| **Customer Portal** | Customers can manage their payment methods |
| **Multi-currency** | Supports AUD, JPY, USD, and 135+ currencies |
| **Free until you earn** | 0 monthly fee, 1.75% + $0.30 per transaction (AU) |
| **Test Mode** | Full testing with test card numbers |

## Architecture

### Payment Flow with Booking

```
[User selects service & time slot]
    ↓
[User enters customer info]
    ↓
[Frontend calls POST /api/checkout]
    ↓
[Server creates Stripe Checkout Session]
    ↓ (redirect)
[Stripe Checkout Page]  ← User enters card details here
    ↓ (success)
[Redirect to /booking/success?session_id=xxx]
    ↓
[Webhook: checkout.session.completed fires]
    ↓
[Server creates booking in Supabase]
    ↓
[Server sends confirmation email]
```

### Why Stripe Checkout (not custom form)?
- **PCI Compliance**: Stripe handles all card data. You never touch card numbers.
- **Pre-built UI**: Beautiful, mobile-optimized checkout page.
- **3D Secure**: Automatic SCA (Strong Customer Authentication) support.
- **Apple Pay / Google Pay**: Built-in support.
- **Less code**: No need to build custom payment form.

## Setup

### 1. Create Stripe Account
```
1. Go to https://dashboard.stripe.com/register
2. Verify email and business details
3. For testing: Use Test Mode (toggle in top-right of dashboard)
4. For production: Complete business verification
```

### 2. Get API Keys
```
Dashboard → Developers → API Keys

- Publishable key (pk_test_xxx): Used in frontend
- Secret key (sk_test_xxx): Used in server/API routes ONLY
- Webhook signing secret (whsec_xxx): For webhook verification
```

### 3. Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

### 4. Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Implementation

### Core Stripe Configuration

#### `lib/stripe.ts` - Server-side Stripe instance
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',  // Use latest stable API version
  typescript: true,
});
```

#### `lib/stripe-client.ts` - Client-side Stripe instance
```typescript
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
```

### API Endpoints

#### `POST /api/checkout` - Create Checkout Session
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      serviceId,
      serviceName,
      price,         // in dollars (e.g., 60.00)
      date,          // "2026-03-01"
      startTime,     // "10:00"
      endTime,       // "11:00"
      customerName,
      customerEmail,
      customerPhone,
      sizeOption,
      notes,
    } = body;

    // 1. Find or create Stripe customer
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    let stripeCustomerId: string;
    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        metadata: { source: 'booking_system' },
      });
      stripeCustomerId = newCustomer.id;
    }

    // 2. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: serviceName,
              description: `${date} ${startTime} - ${endTime}${sizeOption ? ` (${sizeOption})` : ''}`,
            },
            unit_amount: Math.round(price * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking?cancelled=true`,
      metadata: {
        serviceId,
        date,
        startTime,
        endTime,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        sizeOption: sizeOption || '',
        notes: notes || '',
      },
      // Auto-expire session after 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      // Collect customer's billing address
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### `POST /api/webhooks/stripe` - Handle Stripe Events
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      await handleRefund(charge);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed:', paymentIntent.id);
      // Optionally notify admin
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;

  // 1. Create or update customer in Supabase
  const { data: customer } = await supabase
    .from('customers')
    .upsert({
      email: metadata.customerEmail,
      full_name: metadata.customerName,
      phone: metadata.customerPhone || null,
      stripe_customer_id: session.customer as string,
    }, { onConflict: 'email' })
    .select()
    .single();

  // 2. Create booking in Supabase
  await supabase.from('bookings').insert({
    customer_id: customer!.id,
    service_id: metadata.serviceId,
    booking_date: metadata.date,
    start_time: metadata.startTime,
    end_time: metadata.endTime,
    status: 'confirmed',
    final_price: session.amount_total! / 100,
    size_option: metadata.sizeOption || null,
    stripe_payment_intent_id: session.payment_intent as string,
    notes: metadata.notes || null,
  });

  // 3. Update customer stats
  await supabase.rpc('increment_customer_stats', {
    p_customer_id: customer!.id,
    p_amount: session.amount_total! / 100,
  });

  // 4. Send confirmation email (see Booking System skill)
  // await sendBookingConfirmation(booking, customer);
}

async function handleRefund(charge: Stripe.Charge) {
  // Update booking status in Supabase
  if (charge.payment_intent) {
    await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', charge.payment_intent as string);
  }
}

// IMPORTANT: Disable body parsing for webhooks (Next.js App Router)
export const config = {
  api: {
    bodyParser: false,
  },
};
```

#### `POST /api/bookings/cancel` - Cancel Booking & Process Refund
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CANCELLATION_POLICY = {
  freeCancellationHours: 24,
  lateCancellationFeePercent: 50,
};

export async function POST(req: NextRequest) {
  try {
    const { bookingId, cancelToken, reason } = await req.json();

    // 1. Verify booking and cancel token
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, services(*)')
      .eq('id', bookingId)
      .eq('cancel_token', cancelToken)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found or invalid token' },
        { status: 404 }
      );
    }

    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'Booking is already cancelled or completed' },
        { status: 400 }
      );
    }

    // 2. Calculate refund based on cancellation policy
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const hoursUntilBooking = (bookingDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    let refundAmount: number;
    let refundPercent: number;

    if (hoursUntilBooking >= CANCELLATION_POLICY.freeCancellationHours) {
      // Full refund
      refundPercent = 100;
      refundAmount = booking.final_price * 100; // Convert to cents
    } else if (hoursUntilBooking > 0) {
      // Partial refund (late cancellation)
      refundPercent = 100 - CANCELLATION_POLICY.lateCancellationFeePercent;
      refundAmount = Math.round(booking.final_price * refundPercent); // cents
    } else {
      // No refund (past booking time)
      refundPercent = 0;
      refundAmount = 0;
    }

    // 3. Process refund via Stripe
    if (refundAmount > 0 && booking.stripe_payment_intent_id) {
      await stripe.refunds.create({
        payment_intent: booking.stripe_payment_intent_id,
        amount: refundAmount,
        reason: 'requested_by_customer',
        metadata: {
          bookingId: booking.id,
          cancellationReason: reason || '',
        },
      });
    }

    // 4. Update booking status
    await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    // 5. Send cancellation email (see Booking System skill)
    // await sendCancellationEmail(booking, refundPercent);

    return NextResponse.json({
      success: true,
      refundPercent,
      refundAmount: refundAmount / 100,
      message: refundPercent === 100
        ? 'Full refund has been processed.'
        : refundPercent > 0
        ? `A ${refundPercent}% refund has been processed.`
        : 'No refund applicable (past booking time).',
    });
  } catch (error: any) {
    console.error('Cancel error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Frontend: Checkout Button Component

```typescript
// components/CheckoutButton.tsx
'use client';

import { useState } from 'react';

interface CheckoutButtonProps {
  serviceId: string;
  serviceName: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  sizeOption?: string;
  notes?: string;
}

export function CheckoutButton(props: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="checkout-button"
    >
      {loading ? 'Processing...' : `Pay $${props.price.toFixed(2)} & Confirm Booking`}
    </button>
  );
}
```

### Frontend: Cancellation Page

```typescript
// app/booking/cancel/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CancelBookingPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const cancelToken = searchParams.get('token');
  const [booking, setBooking] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId && cancelToken) {
      fetch(`/api/bookings/${bookingId}?token=${cancelToken}`)
        .then(res => res.json())
        .then(data => setBooking(data));
    }
  }, [bookingId, cancelToken]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    const response = await fetch('/api/bookings/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, cancelToken, reason }),
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  if (result?.success) {
    return (
      <div className="cancel-success">
        <h1>Booking Cancelled</h1>
        <p>{result.message}</p>
        <a href="/">Book Again</a>
      </div>
    );
  }

  return (
    <div className="cancel-page">
      <h1>Cancel Booking</h1>
      {booking && (
        <>
          <div className="booking-details">
            <p><strong>Service:</strong> {booking.service_name}</p>
            <p><strong>Date:</strong> {booking.booking_date}</p>
            <p><strong>Time:</strong> {booking.start_time}</p>
          </div>
          <div className="cancellation-policy">
            <h3>Cancellation Policy</h3>
            <p>• Free cancellation up to 24 hours before appointment</p>
            <p>• Within 24 hours: 50% cancellation fee applies</p>
          </div>
          <textarea
            placeholder="Reason for cancellation (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button onClick={handleCancel} disabled={loading}>
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </>
      )}
    </div>
  );
}
```

## Stripe Webhook Setup

### Local Development (Stripe CLI)
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This gives you a webhook signing secret (whsec_xxx)
# Add it to .env as STRIPE_WEBHOOK_SECRET
```

### Production (Vercel)
```
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: https://yourdomain.com/api/webhooks/stripe
4. Select events:
   - checkout.session.completed
   - charge.refunded
   - payment_intent.payment_failed
   - customer.subscription.deleted (if using subscriptions)
5. Copy the signing secret → Add to Vercel environment variables
```

## Testing

### Test Card Numbers
```
Success:                4242 4242 4242 4242
Requires authentication: 4000 0025 0000 3155
Declined:               4000 0000 0000 0002
Insufficient funds:     4000 0000 0000 9995

Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
```

### Testing Webhooks Locally
```bash
# Terminal 1: Run your app
npm run dev

# Terminal 2: Forward Stripe events
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger test events
stripe trigger checkout.session.completed
stripe trigger charge.refunded
```

## Advanced Features

### 1. Hold Card Without Charging (Setup Intent)
For no-show protection: capture card details at booking, charge only for no-shows.

```typescript
// Create a Setup Intent (saves card without charging)
const setupIntent = await stripe.setupIntents.create({
  customer: stripeCustomerId,
  payment_method_types: ['card'],
  metadata: { bookingId },
});

// Later, charge for no-show:
const paymentIntent = await stripe.paymentIntents.create({
  amount: noShowFee * 100,
  currency: 'aud',
  customer: stripeCustomerId,
  payment_method: setupIntent.payment_method as string,
  off_session: true,
  confirm: true,
  metadata: { bookingId, type: 'no_show_fee' },
});
```

### 2. Stripe Customer Portal
Let customers manage their own payment methods.

```typescript
// Create a portal session
const portalSession = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
});

// Redirect customer to portal
res.redirect(portalSession.url);
```

### 3. Automatic Receipts
```
Stripe Dashboard → Settings → Emails
→ Enable "Successful payments" email receipts
→ Customers automatically get receipts
```

### 4. Multi-Currency Support
```typescript
// Detect currency based on customer location or set explicitly
const session = await stripe.checkout.sessions.create({
  // ...
  line_items: [{
    price_data: {
      currency: customerCurrency || 'aud', // 'jpy' for Japanese customers
      // ...
    },
  }],
});
```

## Security Best Practices

1. **Never expose Secret Key**: Only use in server-side code
2. **Always verify webhooks**: Use `stripe.webhooks.constructEvent()` with signing secret
3. **Use HTTPS**: Required for Stripe in production
4. **Idempotency**: Use idempotency keys for retried requests
5. **Amount validation**: Verify price server-side, never trust client-sent amounts
6. **Logging**: Log all payment events for audit trail
7. **PCI Compliance**: Use Stripe Checkout or Elements (never handle raw card data)

## Supabase Helper Function

```sql
-- Function to increment customer stats after successful payment
CREATE OR REPLACE FUNCTION increment_customer_stats(
  p_customer_id UUID,
  p_amount DECIMAL
) RETURNS void AS $$
BEGIN
  UPDATE customers
  SET
    total_bookings = total_bookings + 1,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE id = p_customer_id;
END;
$$ LANGUAGE plpgsql;
```

## Implementation Checklist

### Phase 1: Stripe Setup
- [ ] Create Stripe account (Test Mode)
- [ ] Get API keys (publishable + secret)
- [ ] Install stripe and @stripe/stripe-js
- [ ] Configure environment variables
- [ ] Set up Stripe CLI for local webhook testing

### Phase 2: Checkout Flow
- [ ] Create POST /api/checkout endpoint
- [ ] Build CheckoutButton component
- [ ] Create success page with session verification
- [ ] Create cancel/return page

### Phase 3: Webhooks
- [ ] Create POST /api/webhooks/stripe endpoint
- [ ] Handle checkout.session.completed
- [ ] Handle charge.refunded
- [ ] Handle payment_intent.payment_failed
- [ ] Test with Stripe CLI

### Phase 4: Cancellation & Refunds
- [ ] Create POST /api/bookings/cancel endpoint
- [ ] Implement cancellation policy logic (time-based refund)
- [ ] Build cancellation page (from email link)
- [ ] Test full cancel + refund flow

### Phase 5: Production
- [ ] Switch to live Stripe keys
- [ ] Add webhook endpoint in Stripe Dashboard
- [ ] Enable automatic receipts
- [ ] Complete Stripe business verification
- [ ] Test with real card (small amount)

## Integration with Booking System Skill

This skill is designed to work alongside the **Booking System** skill:

1. **Booking System** handles: Service selection, calendar, time slots, customer info
2. **Stripe Payment** handles: Payment processing, refunds, card management
3. **Connection point**: After customer info is collected, redirect to Stripe Checkout
4. **Webhook**: On payment success, Booking System creates the booking record
5. **Cancellation**: Booking System initiates cancel, Stripe processes refund

```
[Booking System] → Customer completes form → [Stripe Payment]
                                                    ↓
                                        Stripe Checkout Page
                                                    ↓
                                    Payment Success (webhook)
                                                    ↓
                                [Booking System] ← Creates booking
```

## Usage Instructions for Antigravity

When invoking this skill:

1. **Read this SKILL.md** to internalize all guidelines
2. **Check if Booking System skill is also needed** - they usually go together
3. **Guide user through Stripe account setup** if not already done
4. **Implement in order**: Setup → Checkout → Webhooks → Cancellation
5. **Always test with Stripe CLI** before deploying
6. **Never hardcode API keys** - always use environment variables
7. **Verify amounts server-side** - never trust client-sent prices

---

This skill provides a complete, production-ready Stripe payment integration blueprint for any web application.
