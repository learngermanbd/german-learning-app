# PHASE 15 — Payment Integration (Optional)

> **Competitive Context:** Talkpal charges $14.99/month. Our free tier is generous, but premium features (unlimited AI, advanced analytics, priority support) can generate revenue. B2B pricing for schools ($50-200/month) is our sustainable revenue model.

## Objective
Implement Stripe payment integration: subscription tiers, payment processing, invoicing, and billing management. Target: Flexible monetization with free tier + premium upgrades + B2B pricing.

## Prerequisites
- Phases 0-10 complete
- User authentication working
- Admin panel functional
- Stripe account created (free to set up)

## Architecture Overview

```
Payment Architecture
─────────────────────────────────────────
┌─────────────────────────────────────────┐
│           USER INTERFACE                │
├─────────────────────────────────────────┤
│ Pricing Page │ Checkout │ Billing Portal│
└────────┬──────┴────┬─────┴──────┬──────┘
         │           │            │
         v           v            v
┌─────────────────────────────────────────┐
│           BACKEND API                   │
├─────────────────────────────────────────┤
│ Payment Routes │ Webhook Handler │ Sub  │
└────────┬───────┴────────┬────────┴──┬──┘
         │                │           │
         v                v           v
┌─────────────────────────────────────────┐
│           STRIPE API                    │
├─────────────────────────────────────────┤
│ Checkout │ Subscriptions │ Invoices    │
└─────────────────────────────────────────┘
```

## Files to Create/Update

### 1. Stripe Configuration

**`backend/src/config/stripe.js`** — Stripe configuration:
```javascript
// Stripe configuration:
// - Initialize Stripe with API key from env
// - Export stripe instance
// - Configuration:
//   - API version: '2023-10-16'
//   - Max network retries: 2
//   - Timeout: 10000ms
// Environment variables:
//   STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
//   STRIPE_WEBHOOK_SECRET=whsec_...
//   STRIPE_PUBLISHABLE_KEY=pk_test_... (for frontend)
```

**`backend/src/config/pricing.js`** — Pricing tiers configuration:
```javascript
// Pricing tiers:
// export const PRICING_TIERS = {
//   free: {
//     name: 'Free',
//     price: 0,
//     features: [
//       'Access to all courses (A1-C1)',
//       'Unlimited exercises & quizzes',
//       'AI chat tutor (20 messages/day)',
//       'Basic progress tracking',
//       'Community forum access'
//     ],
//     limits: { aiMessagesPerDay: 20, storage: '50MB' }
//   },
//   premium: {
//     name: 'Premium',
//     price: 9.99,
//     interval: 'month',
//     stripePriceId: 'price_...', // Create in Stripe dashboard
//     features: [
//       'Everything in Free',
//       'Unlimited AI chat tutor',
//       'AI speaking practice',
//       'AI writing evaluation',
//       'Advanced analytics',
//       'Priority support',
//       'Offline downloads'
//     ],
//     limits: { aiMessagesPerDay: -1, storage: '5GB' }
//   },
//   schools: {
//     name: 'Schools & Institutions',
//     price: 99,
//     interval: 'month',
//     stripePriceId: 'price_...',
//     features: [
//       'Everything in Premium',
//       'Admin training panel',
//       'Custom AI prompts',
//       'Bulk student management',
//       'Classroom analytics',
//       'Priority support',
//       'Dedicated account manager'
//     ],
//     limits: { students: 100, storage: '50GB' }
//   }
// };
```

### 2. Payment Models

**`backend/src/prisma/schema.prisma`** — Add payment models:
```prisma
// Add to existing schema:

model Subscription {
  id              String   @id @default(uuid())
  userId          String   @unique
  stripeCustomerId String?  @unique
  stripeSubscriptionId String? @unique
  tier            String   @default("free") // free, premium, schools
  status          String   @default("active") // active, canceled, past_due, unpaid
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd  Boolean @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id])
  invoices        Invoice[]
  payments        Payment[]
}

model Invoice {
  id              String   @id @default(uuid())
  subscriptionId  String
  stripeInvoiceId String?  @unique
  amount          Int      // in cents
  currency        String   @default("usd")
  status          String   // draft, open, paid, void, uncollectible
  invoiceUrl      String?
  invoicePdf      String?
  periodStart     DateTime
  periodEnd       DateTime
  paidAt          DateTime?
  createdAt       DateTime @default(now())
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
}

model Payment {
  id              String   @id @default(uuid())
  subscriptionId  String
  stripePaymentIntentId String? @unique
  amount          Int      // in cents
  currency        String   @default("usd")
  status          String   // succeeded, failed, pending, refunded
  paymentMethod   String?  // card, bank_transfer, etc.
  receiptUrl      String?
  createdAt       DateTime @default(now())
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
}

model UsageRecord {
  id              String   @id @default(uuid())
  userId          String
  feature         String   // ai_chat, ai_speaking, ai_writing
  quantity        Int      // tokens, messages, etc.
  recordedAt      DateTime @default(now())
  @@index([userId, recordedAt])
}
```

### 3. Payment Routes

**`backend/src/routes/payments.js`** — Payment API:
```javascript
// Payment endpoints:
// POST /api/payments/checkout — Create Stripe Checkout session
//   - Input: { tier: 'premium' | 'schools' }
//   - Output: { sessionId, url }
//   - Features: Success/cancel URLs, customer email, trial period
//
// POST /api/payments/portal — Create Stripe Customer Portal session
//   - Output: { url }
//   - Features: Update payment method, view invoices, cancel subscription
//
// GET /api/payments/subscription — Get current subscription
//   - Output: { tier, status, currentPeriodEnd, cancelAtPeriodEnd }
//
// POST /api/payments/cancel — Cancel subscription
//   - Features: Cancel at period end (keep access until then)
//
// POST /api/payments/reactivate — Reactivate canceled subscription
//
// GET /api/payments/invoices — List user's invoices
//   - Output: { invoices: [{ id, amount, status, invoiceUrl, period }] }
//
// GET /api/payments/invoice/:id — Get invoice PDF
//   - Output: { invoicePdf }
```

**`backend/src/controllers/paymentController.js`** — Payment controller:
```javascript
// Controller: paymentController
// Methods:
//   - createCheckoutSession(userId, tier): Create Stripe Checkout
//   - createPortalSession(userId): Create Customer Portal
//   - getSubscription(userId): Get current subscription details
//   - cancelSubscription(userId): Cancel at period end
//   - reactivateSubscription(userId): Reactivate canceled sub
//   - listInvoices(userId): List user's invoices
//   - getInvoice(invoiceId): Get invoice PDF URL
// Features:
//   - Automatic customer creation on first purchase
//   - Subscription status sync with Stripe
//   - Usage tracking for metered billing
//   - Webhook signature verification
```

### 4. Webhook Handler

**`backend/src/routes/webhooks.js`** — Stripe webhook handler:
```javascript
// Webhook endpoint: POST /api/webhooks/stripe
// Events to handle:
//   - checkout.session.completed: Activate subscription
//   - customer.subscription.updated: Sync status changes
//   - customer.subscription.deleted: Deactivate subscription
//   - invoice.payment_succeeded: Record payment, extend access
//   - invoice.payment_failed: Notify user, retry logic
//   - customer.subscription.trial_will_end: Send reminder email
// Security:
//   - Verify webhook signature with stripe.webhooks.constructEvent
//   - Use raw body for signature verification
//   - Idempotency: Check if event already processed
```

**`backend/src/services/webhookService.js`** — Webhook processing:
```javascript
// Service: webhookService
// Methods:
//   - handleCheckoutCompleted(session): Activate subscription
//   - handleSubscriptionUpdated(subscription): Sync status
//   - handleSubscriptionDeleted(subscription): Deactivate
//   - handleInvoicePaid(invoice): Record payment
//   - handleInvoiceFailed(invoice): Notify user, retry
//   - handleTrialEnding(subscription): Send reminder
// Features:
//   - Idempotent processing (check if already handled)
//   - Error handling (don't fail webhook on processing errors)
//   - Logging (log all webhook events)
//   - Email notifications (on key events)
```

### 5. Usage Tracking

**`backend/src/middleware/usageTracker.js`** — Feature usage tracking:
```javascript
// Middleware: usageTracker(feature, cost)
// Tracks: AI messages, speaking evaluations, writing grades
// Features:
//   - Increment usage count per user per day
//   - Check against tier limits
//   - Return 429 when limit exceeded
//   - Record usage for metered billing
//   - Reset counts daily (cron job)
// Usage: router.post('/api/ai/chat', usageTracker('ai_chat', 1), controller.chat)
```

**`backend/src/services/usageService.js`** — Usage management:
```javascript
// Service: usageService
// Methods:
//   - recordUsage(userId, feature, quantity): Record feature usage
//   - getUsage(userId, feature, period): Get usage count
//   - checkLimit(userId, feature): Check if within tier limits
//   - resetDailyUsage(): Reset daily counters (cron)
//   - getUsageStats(userId): Get usage summary
//   - getUsageHistory(userId, days): Get usage over time
// Limits by tier:
//   - free: 20 AI messages/day, 5 speaking evals/day
//   - premium: Unlimited
//   - schools: Unlimited + custom limits
```

### 6. Frontend — Pricing & Checkout

**`frontend/src/pages/Pricing.jsx`** — Pricing page:
```javascript
// Page: Pricing
// Layout:
//   - Hero: "Simple, Transparent Pricing"
//   - Toggle: Monthly / Annual (save 20%)
//   - 3 pricing cards: Free, Premium, Schools
//   - Feature comparison table
//   - FAQ accordion
//   - CTA: "Start Free" / "Upgrade to Premium"
// Design: Follow DESIGN_REFERENCE.md card styles
// Responsive: Stack cards on mobile
```

**`frontend/src/components/PricingCard.jsx`** — Pricing card component:
```javascript
// Component: PricingCard
// Props: { tier, isCurrentTier, onSelect, annual }
// Features:
//   - Highlight current tier
//   - Show price (monthly/annual)
//   - List features with checkmarks
//   - CTA button (Start Free / Upgrade / Contact Sales)
//   - Popular badge for Premium tier
//   - Hover animation (lift + glow)
```

**`frontend/src/components/CheckoutButton.jsx`** — Checkout integration:
```javascript
// Component: CheckoutButton
// Props: { tier, children, className }
// Features:
//   - Create checkout session via API
//   - Redirect to Stripe Checkout
//   - Handle loading state
//   - Handle errors
//   - Track conversion event
```

**`frontend/src/pages/Billing.jsx`** — Billing management page:
```javascript
// Page: Billing
// Features:
//   - Current plan display
//   - Usage stats (AI messages used today)
//   - Upgrade/downgrade buttons
//   - Invoice history table
//   - Download invoice PDF
//   - Manage payment method (Stripe Portal link)
//   - Cancel subscription (with confirmation)
// Route: /billing
```

### 7. Admin — Subscription Management

**`admin/src/pages/subscriptions/SubscriptionsList.jsx`** — Admin subscriptions page:
```javascript
// Page: SubscriptionsList
// Features:
//   - Table: User, Tier, Status, Revenue, Start Date, End Date
//   - Filters: Tier, Status, Date Range
//   - Search by email/name
//   - Export to CSV
//   - Total MRR (Monthly Recurring Revenue)
//   - Churn rate
//   - Conversion rate
// Route: /admin/subscriptions
```

**`admin/src/pages/subscriptions/RevenueDashboard.jsx`** — Revenue analytics:
```javascript
// Page: RevenueDashboard
// Features:
//   - MRR chart (Recharts LineChart)
//   - Revenue by tier (PieChart)
//   - Churn rate trend
//   - Customer lifetime value
//   - Conversion funnel
//   - Forecast projections
// Route: /admin/revenue
```

### 8. Email Notifications

**`backend/src/services/email/billingEmails.js`** — Billing email templates:
```javascript
// Email templates:
// - subscriptionActivated: Welcome to Premium! Receipt attached.
// - subscriptionCanceled: Sorry to see you go. Access until [date].
// - paymentFailed: Payment failed. Please update your card.
// - invoiceReady: Your invoice for [month] is ready.
// - trialEnding: Your trial ends in 3 days. Upgrade now!
// - usageLimitReached: You've reached your daily limit. Upgrade for unlimited.
// Integration: Use existing emailSender utility
```

## Validation Checklist

After completing this phase, verify:

- [ ] Pricing page loads and displays all tiers
- [ ] Checkout flow works: Click Upgrade → Stripe Checkout → Success
- [ ] Webhook receives events: Check Stripe webhook logs
- [ ] Subscription activates: User tier updates after payment
- [ ] Usage limits enforce: Free user hits 20 messages → 429
- [ ] Billing page shows current plan and invoices
- [ ] Stripe Portal works: Update payment method, view invoices
- [ ] Cancellation works: Cancel → access until period end
- [ ] Invoice PDFs download correctly
- [ ] Email notifications send on key events
- [ ] Admin revenue dashboard shows data
- [ ] MRR calculation is correct

## Payment Benchmarks

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Checkout Load | <2s | Stripe Checkout page load |
| Webhook Processing | <5s | Time from event to database update |
| Usage Check | <50ms | Time to check tier limits |
| Invoice Generation | <10s | Time to generate PDF |
| Email Delivery | <30s | Time from event to email send |

## Competitive Advantage Check

- [ ] Free tier is more generous than Talkpal's (20 messages vs 10 minutes)
- [ ] Premium is cheaper than Talkpal ($9.99 vs $14.99)
- [ ] B2B pricing for schools (Talkpal has no B2B)
- [ ] Transparent pricing (no dark patterns like Talkpal)
- [ ] Easy cancellation (Talkpal users complain about hard cancellation)

---

*Estimated time: 3-4 hours | Files: ~12 | Priority: Optional*
