---
name: Booking System
description: Build a complete booking/scheduling system with calendar UI, time slot management, customer data storage (Supabase), email notifications (Resend), and cancellation policy enforcement. Reusable for any service-based website.
---

# Booking System Skill

## Overview
This skill enables you to build a **production-ready booking/scheduling system** for service-based businesses (salons, clinics, consulting, etc.). It covers the full lifecycle: browsing available slots → selecting a service → entering customer info → confirming booking → email notifications → managing/cancelling bookings.

## Architecture

### Recommended Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js (App Router) or Vite + React | SSR/SSG, API routes, fast |
| **Backend/API** | Next.js API Routes / Vercel Serverless Functions | Zero server management |
| **Database** | Supabase (PostgreSQL) | Free tier generous, RLS, realtime |
| **Email** | Resend (recommended) or SendGrid | Developer-friendly, free tier |
| **Calendar UI** | Custom React component or react-day-picker | Lightweight, customizable |
| **Hosting** | Vercel | Free, auto-deploy from Git |

### System Flow

```
[User visits site]
    ↓
[Selects service/menu] → Shows price, duration
    ↓
[Selects date] → Calendar shows available dates
    ↓
[Selects time slot] → Shows available time slots for that date
    ↓
[Enters customer info] → Name, email, phone
    ↓
[Confirms booking] → (Optional: Stripe payment here - see Stripe skill)
    ↓
[API creates booking in Supabase]
    ↓
[Sends confirmation email via Resend]
    ↓
[Schedules reminder email (24h before)]
    ↓
[User can cancel via unique link in email]
```

## Database Schema (Supabase)

### Tables

#### 1. `services` - メニュー/サービス一覧
```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                    -- e.g., "Mens Cut"
  name_ja TEXT,                          -- e.g., "メンズカット"
  category TEXT NOT NULL,                -- e.g., "Cut", "Color", "Perm", "Straight", "Others"
  description TEXT,
  price_min DECIMAL(10,2) NOT NULL,      -- e.g., 50.00
  price_max DECIMAL(10,2),               -- null if single price, or max for S/M/L range
  price_note TEXT,                        -- e.g., "S $80 / M $100 / L $120〜"
  duration_minutes INT NOT NULL DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `business_hours` - 営業時間
```sql
CREATE TABLE business_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INT NOT NULL,               -- 0=Sunday, 1=Monday, ..., 6=Saturday
  open_time TIME,                          -- null if closed
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `blocked_dates` - 休業日/ブロック日
```sql
CREATE TABLE blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocked_date DATE NOT NULL,
  reason TEXT,                             -- e.g., "Holiday", "Personal day off"
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `customers` - 顧客データ
```sql
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  stripe_customer_id TEXT,                 -- Link to Stripe (see Stripe skill)
  notes TEXT,
  total_bookings INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `bookings` - 予約データ
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed',          -- confirmed, cancelled, completed, no_show
  final_price DECIMAL(10,2),
  size_option TEXT,                          -- S, M, L (for variable pricing)
  stripe_payment_intent_id TEXT,             -- Link to Stripe payment
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancel_token UUID DEFAULT gen_random_uuid(), -- Unique token for cancel link
  reminder_sent BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Public can insert (for new bookings)
CREATE POLICY "Allow public insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON customers FOR INSERT WITH CHECK (true);

-- Only service role can read/update/delete (admin operations)
CREATE POLICY "Service role full access" ON bookings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON customers FOR ALL USING (auth.role() = 'service_role');
```

## Frontend Components

### 1. ServiceSelector Component
```
Purpose: Display available services grouped by category
Features:
- Category tabs (Cut, Color, Perm, Straight, Others)
- Each service card shows name, price range, duration
- Selected service highlighted with accent color
- Mobile-responsive grid layout
```

### 2. DatePicker Component
```
Purpose: Calendar for selecting booking date
Features:
- Monthly calendar view with navigation arrows
- Disabled dates: past dates, closed days, blocked dates, fully booked dates
- Highlighted today's date
- Selected date with accent styling
- Fetches available dates from API on month change
```

### 3. TimeSlotPicker Component
```
Purpose: Show available time slots for selected date
Features:
- Grid of time slots (e.g., 30-min intervals)
- Grey out unavailable slots (already booked, outside business hours)
- Show remaining capacity if applicable
- Selected slot with accent styling
```

### 4. CustomerInfoForm Component
```
Purpose: Collect customer information
Fields:
- Full Name (required)
- Email (required, validated)
- Phone Number (optional but recommended)
- Special requests/notes (optional textarea)
Validation:
- Client-side: email format, required fields
- Server-side: duplicate check, sanitization
```

### 5. BookingConfirmation Component
```
Purpose: Summary before final confirmation
Shows:
- Selected service, date, time
- Customer info summary
- Price (with size option if applicable)
- Cancellation policy notice
- "Confirm Booking" button
- "Back" button to edit
```

### 6. BookingSuccess Component
```
Purpose: Confirmation after successful booking
Shows:
- Booking reference number
- Summary of booking details
- "A confirmation email has been sent" message
- Add to Calendar button (generates .ics file)
- Link to cancel/modify booking
```

## API Endpoints

### `GET /api/services`
Returns active services grouped by category.

### `GET /api/available-dates?month=YYYY-MM&serviceId=xxx`
Returns available dates for a given month and service.
- Checks business hours, blocked dates, existing bookings
- Returns array of available date strings

### `GET /api/available-slots?date=YYYY-MM-DD&serviceId=xxx`
Returns available time slots for a given date and service.
- Calculates slots based on business hours and service duration
- Excludes already booked slots
- Returns array of { startTime, endTime, available: boolean }

### `POST /api/bookings`
Creates a new booking.
```json
{
  "serviceId": "uuid",
  "date": "2026-03-01",
  "startTime": "10:00",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+61412345678",
  "sizeOption": "M",
  "notes": "First time visitor"
}
```
Response: booking confirmation with ID and cancel token.

### `POST /api/bookings/cancel`
Cancels a booking using cancel token.
```json
{
  "bookingId": "uuid",
  "cancelToken": "uuid",
  "reason": "Schedule change"
}
```
Enforces cancellation policy (see below).

### `GET /api/bookings/[id]?token=xxx`
View booking details (for cancel page link in email).

## Email Notifications

### Setup with Resend
```
1. Sign up at resend.com (free: 3,000 emails/month)
2. Add and verify your domain (or use onboarding@resend.dev for testing)
3. Get API key → store in .env as RESEND_API_KEY
4. Install: npm install resend
```

### Email Templates

#### Booking Confirmation Email
```
Subject: ご予約確認 - {ServiceName} on {Date}
Content:
- Greeting with customer name
- Booking details (service, date, time, price)
- Salon address & parking info
- Cancellation policy reminder
- Cancel/modify link with unique token
- Contact information
```

#### Reminder Email (24h before)
```
Subject: 明日のご予約リマインダー - {ServiceName}
Content:
- Friendly reminder
- Booking details
- Parking/access directions
- "Looking forward to seeing you!"
- Cancel link (if within policy window)
```

#### Cancellation Confirmation Email
```
Subject: ご予約キャンセル確認
Content:
- Cancellation acknowledged
- Refund info (if applicable, links to Stripe skill)
- Rebooking encouragement
- Link to rebook
```

### Resend Implementation Example
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBookingConfirmation(booking: Booking, customer: Customer) {
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: customer.email,
    subject: `ご予約確認 - ${booking.serviceName} on ${formatDate(booking.date)}`,
    html: generateConfirmationHTML(booking, customer),
  });
}
```

### Reminder Scheduling
```
Option A: Vercel Cron Jobs (recommended, free tier: 1 cron job)
  - Run daily at 9:00 AM to check bookings for tomorrow
  - Send reminders for all unreminded bookings

Option B: Supabase Edge Functions with pg_cron
  - Native PostgreSQL scheduling

vercel.json cron config:
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 23 * * *"  // 9:00 AM AEST (UTC+10)
  }]
}
```

## Cancellation Policy

### Configurable Policy Options
```typescript
const CANCELLATION_POLICY = {
  // Free cancellation window (hours before appointment)
  freeCancellationHours: 24,

  // Late cancellation fee (percentage of service price)
  lateCancellationFeePercent: 50,

  // No-show fee (percentage of service price)
  noShowFeePercent: 100,

  // Policy text for display
  policyText: {
    en: "Free cancellation up to 24 hours before your appointment. Cancellations within 24 hours may incur a 50% charge.",
    ja: "ご予約の24時間前まで無料キャンセル可能です。24時間以内のキャンセルはサービス料金の50%をいただく場合がございます。"
  }
};
```

### Cancellation Flow
```
1. Customer clicks cancel link in email
2. System checks cancellation window
3. If within free window → Cancel immediately, full refund if paid
4. If outside free window → Show late cancellation fee warning
5. Customer confirms → Cancel with fee applied
6. Send cancellation confirmation email
7. Process refund via Stripe (see Stripe skill)
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_TIMEZONE=Australia/Brisbane
```

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up Next.js project (or add to existing Vite project)
- [ ] Create Supabase project and tables
- [ ] Seed services data from menu
- [ ] Set up business hours

### Phase 2: Booking Flow
- [ ] Build ServiceSelector component
- [ ] Build DatePicker with availability check
- [ ] Build TimeSlotPicker component
- [ ] Build CustomerInfoForm with validation
- [ ] Build BookingConfirmation summary
- [ ] Build BookingSuccess page
- [ ] Create all API endpoints

### Phase 3: Notifications
- [ ] Set up Resend account
- [ ] Create email templates (confirmation, reminder, cancellation)
- [ ] Implement booking confirmation email
- [ ] Set up cron job for reminders

### Phase 4: Cancellation
- [ ] Build cancellation page (linked from email)
- [ ] Implement cancellation policy logic
- [ ] Send cancellation confirmation email
- [ ] Integrate with Stripe refund (see Stripe skill)

### Phase 5: Admin (Optional)
- [ ] Admin dashboard to view/manage bookings
- [ ] Block dates functionality
- [ ] Customer list view
- [ ] Booking statistics

## Design Guidelines

### Calendar & Booking UI
- Use the brand color palette from the project's design system
- Calendar: clean, minimal, with clear available/unavailable distinction
- Time slots: pill-shaped buttons in a responsive grid
- Smooth transitions between steps (slide or fade)
- Mobile-first responsive design
- Loading states with skeleton screens
- Error states with clear messaging

### Accessibility
- Keyboard navigation for calendar and time slots
- ARIA labels for interactive elements
- Color contrast ratios meeting WCAG AA
- Focus indicators on all interactive elements

## Usage Instructions for Antigravity

When invoking this skill:

1. **Read this SKILL.md** to internalize all guidelines
2. **Determine the project context**:
   - Is this a new project or adding to existing?
   - What framework is being used? (Next.js, Vite, etc.)
   - What services/menus need to be configured?
3. **Set up infrastructure first**:
   - Create Supabase project (guide user through setup)
   - Create database tables using the schema above
   - Set up Resend for email
4. **Build components in order**: Services → Calendar → Time Slots → Form → Confirmation
5. **Implement API endpoints**: Match the frontend components
6. **Set up email notifications**: Confirmation → Reminder → Cancellation
7. **Test the full flow**: End-to-end booking test
8. **If payment is needed**: Invoke the Stripe Payment skill

## Important Notes

- **Time Zone Handling**: Always use the IANA timezone (e.g., `Australia/Brisbane`). Store all times in UTC in the database, display in local time.
- **Conflict Prevention**: Use database-level constraints or transactions to prevent double-booking.
- **Rate Limiting**: Add rate limiting to booking API to prevent abuse.
- **Data Privacy**: Customer data is PII. Use HTTPS, RLS, and never expose in client-side code.
- **Testing**: Test edge cases: midnight bookings, DST changes, concurrent bookings.

---

This skill provides a complete, reusable blueprint for building booking/scheduling systems for any service-based business.
