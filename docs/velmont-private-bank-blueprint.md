# Velmont Private Bank Launch Blueprint

Version: 0.1  
Date: 2026-05-08  
Status: Founder operating draft, not legal advice

## 1. Executive Direction

Velmont Private Bank is a US-based private neobank launched through a sponsor bank / Banking-as-a-Service model. Velmont is not initially a chartered bank. Customer deposits are held at one or more FDIC-insured sponsor banks, with Velmont acting as the program manager, customer experience layer, and fintech operating company.

Brand architecture:

- Parent product: Velmont Private Bank
- Savings / wealth vaults: Velmont Vault
- Premium tier: Velmont Black
- Ultra-wealth tier: Velmont Reserve
- Concierge / advisory experience: Velmont Prive

Launch thesis:

Velmont should launch first as a premium subscription-based private banking experience for high-income US consumers and founder/operators. This is faster than a wealth-advisory-led product because it avoids registered investment adviser complexity at MVP, and simpler than SME banking because business KYB, beneficial ownership, fraud, payroll, and treasury workflows add meaningful sponsor-bank review burden.

Fastest compliant MVP:

1. Consumer demand deposit account through sponsor bank.
2. Debit card with card controls.
3. ACH push/pull and internal transfers.
4. Velmont Vault savings goals using sub-ledger allocations, not separate investment products.
5. Premium concierge for support and lifestyle banking assistance, not investment advice.
6. Admin console for KYC review, fraud operations, disputes, complaints, and audit evidence.

## 2. Business Model Options

### Option A: Premium Subscription Private Banking

Target persona:

High-income professionals, executives, creators, founders, consultants, and affluent households who want an elegant banking app, high-touch support, fast onboarding, strong controls, and a private-bank feeling without traditional private-bank minimums.

Revenue streams:

- Monthly subscription: Velmont Black at $49-$99/month.
- Ultra tier: Velmont Reserve at $249-$499/month by invitation.
- Interchange from debit card spend.
- Sponsor-approved account fees where permitted and clearly disclosed.
- Treasury yield share or deposit revenue share, subject to sponsor bank contract.
- Premium wires, expedited card replacement, and concierge service fees.

Risks:

- Premium claims must not imply chartered-bank status.
- Concierge must avoid unlicensed investment, tax, or legal advice.
- High balance customers increase fraud, account takeover, and funds availability risk.
- FDIC insurance messaging must be precise.

Compliance impact:

- Strong KYC/CIP and ongoing monitoring.
- Clear fee disclosures.
- Regulation E dispute handling.
- CFPB complaint management.
- GLBA privacy and safeguards.
- Vendor risk management for sponsor bank, BaaS platform, KYC, card issuing, fraud, and customer support.

Launch difficulty: Lowest.

### Option B: SME / Startup Neobank

Target persona:

Early-stage startups, agencies, holding companies, and small firms needing operating accounts, cards, bill pay, vendor payments, and treasury visibility.

Revenue streams:

- Subscription per company.
- Interchange.
- ACH/wire fees.
- Treasury and deposit revenue share.
- Paid team controls, virtual cards, invoicing, and bill pay.

Risks:

- KYB complexity.
- Beneficial ownership verification.
- Higher ACH return risk.
- Fraud via mule companies, invoice scams, and synthetic businesses.
- More state money transmission analysis if money movement expands beyond bank account features.

Compliance impact:

- Customer due diligence for legal entities.
- Beneficial ownership collection and verification.
- More intensive transaction monitoring.
- Enhanced sanctions and adverse media screening.
- Stronger manual review staffing.

Launch difficulty: Medium to high.

### Option C: Wealth-Focused Neobank

Target persona:

High-income earners who want banking, cash segmentation, market-linked insights, advisory support, and eventually investment products.

Revenue streams:

- Premium membership.
- Interchange.
- Deposit revenue share.
- Advisory fees if a registered investment adviser is created or partnered.
- Referral fees where legally permitted and properly disclosed.

Risks:

- Investment advice, suitability, fiduciary duty, SEC/state RIA registration, FINRA broker-dealer considerations, and marketing rule exposure.
- "Vault" language must not imply investment returns or asset protection unless legally true.

Compliance impact:

- Banking compliance plus investment advisory compliance if personalized investment recommendations are offered.
- Additional recordkeeping, disclosures, supervision, and marketing review.

Launch difficulty: Highest.

Recommendation:

Launch Option A first. Design the product so Option C can be added later through a properly licensed RIA partner or affiliate.

## 3. MVP Product Requirements

### Product Vision

Velmont gives affluent customers a secure, elegant, private-bank-grade digital account with fast onboarding, premium cards, intelligent vaults, trusted support, and bank-grade controls.

### Target Users

- Primary: US consumers with $100k+ income or strong cashflow who value premium service.
- Secondary: founders and independent professionals who want personal banking with higher trust and cleaner money movement.
- Excluded at MVP: minors, non-US persons, cannabis businesses, crypto exchanges, MSBs, sanctioned jurisdictions, shell entities, and investment advisory clients.

### Core Journeys

1. Apply for membership.
2. Complete identity verification and CIP.
3. Accept account agreement, privacy notice, E-SIGN consent, debit card terms, fee schedule, and funds availability disclosures.
4. Open account through sponsor bank.
5. Fund account by ACH or external debit where supported.
6. Use dashboard, card controls, Velmont Vault, alerts, ACH transfers, bill pay, and disputes.
7. Contact Velmont Prive for support.
8. Close account and receive final funds transfer.

### Onboarding Flow

Screens:

1. Welcome: "Velmont Private Bank" with Begin Membership and Sign In.
2. Eligibility: US resident, 18+, SSN/ITIN, phone, email.
3. Identity: legal name, date of birth, SSN/ITIN, address, phone, email.
4. IDV: document capture, selfie/liveness, device intelligence.
5. Risk questions: occupation, source of funds, expected activity, politically exposed person status.
6. Disclosures: E-SIGN, privacy, deposit terms, card terms, fee schedule, FDIC deposit placement statement.
7. Review status: approved, pending manual review, denied with adverse action path where applicable.
8. Initial funding.

### Banking Features

- DDA account display.
- Available and current balance.
- Routing and account number access with step-up authentication.
- Transaction timeline with merchant enrichment.
- Internal Velmont Vault allocations.
- ACH transfers.
- Bill pay through sponsor-approved provider.
- Debit card controls.
- Push, SMS, and email alerts.
- Disputes and error resolution.
- Statements and tax documents where applicable.
- Account closure.

### Debit Card Flow

- Virtual card available after KYC approval and sponsor/card processor activation.
- Physical card ordering for Velmont Black and Velmont Reserve.
- Card controls: freeze/unfreeze, spend limits, merchant categories, international usage, wallet provisioning, PIN management, replacement.
- Premium design: matte black visual, gold accent, subtle typography, no gimmicky claims.

### ACH Transfers

- Link external account using Plaid/Finicity/MX or sponsor-approved account verification.
- Validate account ownership where required.
- Display estimated settlement and availability.
- Support pending, processing, settled, returned, failed, canceled.
- Apply limits based on risk tier, account age, balance, transaction history, and fraud signals.

### Velmont Vault

Vaults are customer-defined balance goals or sub-ledger allocations unless sponsor bank supports separate savings accounts. They must not be marketed as securities, protected trusts, or investment products.

Features:

- Create vault.
- Set target.
- Move funds between main balance and vault allocation.
- Scheduled contributions.
- Progress display.
- Locked vault option with cooling-off period.

### Transaction Alerts

- Card authorization.
- ACH initiated, settled, returned.
- Incoming credit.
- Large transaction.
- Login from new device.
- Profile change.
- Card freeze/unfreeze.
- Low balance.
- Compliance hold or review status using approved language.

### Dispute Management

- Customer selects transaction.
- Intake captures unauthorized, goods/services issue, duplicate, incorrect amount, ATM issue, ACH issue, or other.
- Provide required Regulation E notices and timelines for consumer EFTs.
- Create case for operations review.
- Track provisional credit, representment, final decision, and customer communications.

### Account Closure

- Customer requests closure.
- System blocks if negative balance, pending disputes, pending ACH/card transactions, legal hold, fraud hold, or unresolved compliance review.
- Customer selects destination account.
- Send final statement and closure confirmation.
- Retain records per policy.

## 4. Compliance Playbook

### Regulatory Scope

Velmont must operate as a fintech program manager under sponsor bank oversight. The sponsor bank retains regulatory responsibility for deposit accounts, but Velmont must implement contractual controls, operational controls, monitoring, reporting, and evidence collection expected by the sponsor bank and regulators.

Core obligations:

- BSA/AML program support.
- KYC/CIP collection and verification.
- OFAC screening.
- Fraud monitoring.
- Suspicious activity escalation.
- CTR support where cash-like activity applies through bank rails.
- GLBA privacy and safeguards.
- PCI DSS for cardholder data environment or strict card data outsourcing.
- SOC 2 readiness.
- NACHA rules for ACH origination.
- CFPB/Regulation E consumer protections.
- UDAAP review.
- State money transmitter analysis.

### AML Policy

Minimum elements:

- Written AML policy approved by board or executive risk committee.
- Designated BSA/AML officer or compliance lead.
- Customer risk assessment.
- CIP/KYC procedures.
- OFAC screening procedures.
- Transaction monitoring.
- SAR escalation procedures coordinated with sponsor bank.
- Independent testing.
- Staff training.
- Record retention.

### KYC / CIP

Collect:

- Legal name.
- Date of birth.
- Residential address.
- SSN/ITIN.
- Phone and email.
- Government ID where required by risk or vendor flow.
- Occupation and source of funds for risk scoring.

Verify:

- Documentary verification: government ID, selfie/liveness.
- Non-documentary verification: bureau, phone, address, device, bank account ownership.
- Manual review for exceptions.

Decision outcomes:

- Approved.
- Approved with limits.
- Pending manual review.
- Denied.
- Closed after post-open risk event.

### OFAC Screening

Screen:

- At application.
- Before account opening.
- On profile changes.
- On transaction counterparties where data is available.
- Against list updates.
- During periodic rescreening.

Workflow:

1. Potential match generated.
2. Account opening or transaction paused.
3. Compliance analyst reviews match data.
4. False positive cleared with rationale.
5. True or unresolved match escalated to sponsor bank and legal/compliance.
6. Funds blocked/rejected per sponsor bank and OFAC procedures.

### SAR Workflow

Velmont does not independently file SARs unless legally required by its status. In a sponsor-bank model, the sponsor bank typically owns SAR filing decisions for bank accounts, while Velmont must detect, document, and escalate suspicious activity.

Workflow:

1. Alert from fraud, AML rules, support, law enforcement, or employee referral.
2. Analyst triage within SLA.
3. Case narrative created with customer profile, transactions, counterparties, device/IP, prior alerts, and rationale.
4. Escalate to compliance manager.
5. Sponsor bank referral package submitted.
6. Sponsor bank decides SAR/no SAR.
7. Maintain SAR confidentiality. Do not disclose SAR existence to customer.

### CTR Workflow

Velmont MVP should avoid cash deposits and cash withdrawals beyond standard ATM/debit activity unless the sponsor bank explicitly supports cash products. If cash transactions are available, Velmont must support sponsor bank CTR data collection for reportable currency transactions over applicable thresholds and aggregation rules.

### Customer Risk Scoring

Inputs:

- Identity confidence.
- Device reputation.
- Occupation and source of funds.
- Geography.
- PEP/sanctions/adverse media.
- Expected activity.
- Funding source.
- ACH return history.
- Velocity.
- Dispute history.
- Account age.

Risk levels:

- Low: standard limits.
- Medium: reduced ACH limits, additional monitoring.
- High: manual approval, enhanced due diligence, restricted features.
- Prohibited: deny or close.

### Ongoing Monitoring

Rules:

- High ACH pull velocity.
- Rapid inbound/outbound movement.
- Multiple external accounts.
- Same device across unrelated identities.
- Round-dollar structuring patterns.
- Unusual card-not-present activity.
- Geolocation mismatch.
- Dormant-to-active high-value movement.
- Repeated disputes or ACH returns.

Reviews:

- Daily alert queue.
- Weekly risk review.
- Monthly compliance committee.
- Quarterly sponsor bank review.
- Annual independent review.

### Record Retention

Minimum operating assumption:

- KYC/CIP records: 5 years after account closure.
- Transaction records: 5 years.
- AML investigations and alerts: 5 years.
- Customer complaints: 3-5 years depending on policy and regulator expectations.
- Dispute records: at least Regulation E required period, operationally 5 years.
- Security logs: 1 year hot / 6 years archive for audit-critical events where feasible.
- Corporate and vendor contracts: life of agreement plus 7 years.

Final retention schedule must be approved by counsel and sponsor bank.

### GLBA Privacy

Required:

- Initial privacy notice.
- Annual privacy notice if required by data-sharing practices.
- Opt-out mechanism for non-exempt information sharing.
- Written information security program.
- Vendor security requirements.
- Incident response and breach notification process.

### CFPB / Consumer Complaint Handling

Channels:

- In-app.
- Email.
- Phone.
- Mail.
- Sponsor bank escalation.
- CFPB portal if complaints are routed there.

SLAs:

- Acknowledge within 1 business day.
- Triage within 3 business days.
- Resolve standard complaints within 15 calendar days where possible.
- Escalated regulatory complaints per sponsor bank SLA.
- Root-cause analysis monthly.

### Compliance Staffing

MVP:

- Head of Compliance / BSA program lead.
- Fraud operations lead.
- KYC/AML analysts, outsourced initially if sponsor approved.
- Customer support lead.
- Security lead.
- Vendor risk owner.
- Outside counsel with fintech/BaaS experience.

Scale:

- BSA officer.
- Deputy compliance officer.
- Fraud strategy manager.
- Disputes manager.
- Complaint manager.
- Internal audit or outsourced independent tester.

## 5. Sponsor Bank and BaaS Strategy

### Provider Categories

Direct sponsor bank relationship:

- Slower to secure.
- More diligence and operational burden.
- More control and long-term resilience.
- Better for serious premium bank positioning.

BaaS middleware:

- Faster integration.
- More packaged ledger/account/card APIs.
- Less direct control.
- Higher platform concentration risk.
- Must diligence platform stability, sponsor bank dependencies, and reconciliation controls.

Embedded finance processors:

- Useful for cards, ACH, KYC, ledger, and money movement modules.
- Must verify whether they are system of record or only orchestration layer.

### Common Market Participants to Diligence

Potential BaaS / embedded finance platforms:

- Unit
- Treasury Prime
- Synctera
- Bond / FIS Embedded Finance
- Galileo
- Marqeta
- Stripe Treasury, where available and appropriate
- Adyen Issuing
- Lithic for cards
- Increase for bank integrations
- Modern Treasury for payment operations
- Column for direct bank/API model

Potential sponsor-bank ecosystem names to research and approach:

- Cross River Bank
- Evolve Bank & Trust
- The Bancorp Bank
- Sutton Bank
- Pathward
- Thread Bank
- Lineage Bank
- Lead Bank
- Column N.A.
- Piermont Bank

Sponsor and provider status changes frequently. Before procurement, verify current programs, enforcement history, partner appetite, financial condition, API capabilities, and regulator posture.

### Recommended Approach

For Velmont MVP:

1. Start with a BaaS platform or API-forward bank that supports consumer DDA, debit card issuing, ACH, webhooks, compliance exports, and clean reconciliation.
2. Avoid crypto, lending, investing, international wires, and business banking at MVP.
3. Require daily FBO/customer-level reconciliation and sponsor-bank visibility from day one.
4. Design an internal ledger even if the BaaS has a ledger, so Velmont can reconcile and migrate later.
5. Maintain a sponsor bank exit plan and data portability plan.

## 6. Technical Architecture

### Core Components

- API Gateway: authentication, rate limits, routing.
- Identity Service: user profile, MFA, devices, sessions.
- Onboarding Service: application state, KYC vendor orchestration.
- Account Service: sponsor bank account mapping, balances, account status.
- Ledger Service: internal double-entry ledger and available-balance calculations.
- Transaction Service: card, ACH, internal transfer lifecycle.
- Card Service: virtual/physical card controls and processor webhooks.
- ACH Service: external account links, ACH origination, returns.
- Vault Service: customer savings allocations.
- Notification Service: push, SMS, email, in-app inbox.
- Fraud Engine: rules, velocity, device, anomaly, case creation.
- Compliance Case Service: KYC review, AML alerts, OFAC, complaints.
- Dispute Service: Reg E and card network dispute workflows.
- Admin Dashboard: operations, compliance, support, audit.
- Reporting Service: sponsor bank reports, reconciliation, regulatory exports.
- Audit Log Service: immutable event trail.

### Recommended Stack

- Cloud: AWS.
- Backend: TypeScript/NestJS or Kotlin/Spring Boot.
- API: REST for product APIs, event-driven internals, OpenAPI specs.
- Database: PostgreSQL for core relational data.
- Ledger database: PostgreSQL with strict constraints, serializable transaction handling, and append-only journal tables.
- Cache/rate limits: Redis.
- Event bus: AWS EventBridge or Kafka/MSK once scale justifies it.
- Queues: SQS.
- Object storage: S3 with Object Lock for audit artifacts where appropriate.
- Secrets: AWS Secrets Manager and KMS.
- Auth: Cognito/Auth0/WorkOS depending build/buy decision, with step-up MFA.
- Observability: CloudWatch, OpenTelemetry, Datadog, Sentry.
- Data warehouse: Snowflake/BigQuery/Redshift.
- Admin app: React/Next.js with strong role-based access control.

### Architecture Diagram Description

Mobile apps and web app connect to the API Gateway. The gateway routes customer requests to Identity, Onboarding, Account, Transaction, Vault, Card, ACH, Dispute, and Notification services. Third-party integrations sit behind dedicated adapter services for KYC, OFAC, fraud, sponsor bank, card processor, ACH, SMS/email, and support tooling. Every money movement event writes to the Ledger Service and publishes immutable events to the event bus. Reporting and reconciliation consume events into the warehouse and produce sponsor-bank files, operations dashboards, audit evidence, and exception queues. Admin Dashboard accesses operational APIs through separate privileged endpoints with full audit logging.

### Double-Entry Ledger Model

Principles:

- Ledger is append-only.
- Every transaction has balanced debit and credit entries.
- No direct balance mutation without journal entries.
- Idempotency keys are required for all money movement requests.
- Pending and settled balances are separated.
- External processor events are reconciled daily.

Example tables:

```sql
accounts(
  id uuid primary key,
  customer_id uuid null,
  account_type text not null,
  currency char(3) not null default 'USD',
  status text not null,
  created_at timestamptz not null
);

journal_entries(
  id uuid primary key,
  transaction_id uuid not null,
  idempotency_key text not null unique,
  state text not null,
  description text,
  effective_at timestamptz not null,
  created_at timestamptz not null
);

ledger_lines(
  id uuid primary key,
  journal_entry_id uuid not null references journal_entries(id),
  account_id uuid not null references accounts(id),
  direction text not null check (direction in ('debit', 'credit')),
  amount_cents bigint not null check (amount_cents > 0),
  currency char(3) not null,
  created_at timestamptz not null
);
```

States:

- initiated
- pending
- authorized
- posted
- settled
- returned
- reversed
- failed
- canceled

Core API operations:

- `POST /ledger/entries` create balanced journal entry.
- `POST /ledger/holds` create pending hold.
- `POST /ledger/holds/{id}/capture` settle hold.
- `POST /ledger/entries/{id}/reverse` reverse entry.
- `GET /ledger/accounts/{id}/balance` get available/current balance.
- `GET /ledger/reconciliation/exceptions` list mismatches.

## 7. Security and Risk Framework

### SOC 2 Direction

Start with SOC 2 Type I readiness by month 6 and Type II observation period by months 9-12. Scope should include Security, Availability, Confidentiality, and Privacy. Processing Integrity becomes important as ledger and payment operations mature.

### PCI DSS Direction

Minimize PCI scope by never storing PAN/CVV. Use tokenized card processor components, hosted fields, and wallet provisioning APIs. If full PAN display is required, use processor-hosted secure reveal with step-up authentication and audit logging.

### Controls

IAM:

- SSO for employees.
- Hardware security keys for privileged users.
- Least privilege roles.
- Just-in-time production access.
- Quarterly access reviews.
- Immediate offboarding.

Encryption:

- TLS 1.2+ in transit.
- AES-256 at rest via AWS KMS.
- Field-level encryption for SSN/ITIN, identity documents, and sensitive PII.
- Separate keys by environment and data class.

Session security:

- MFA.
- Device binding.
- Risk-based step-up.
- Refresh token rotation.
- Session revocation.
- New device alerts.

Secure SDLC:

- Threat modeling for onboarding, ledger, ACH, card, admin, and support flows.
- Code review required.
- SAST/DAST.
- Dependency scanning.
- Secrets scanning.
- Infrastructure as code review.
- Change management with approvals for production.

Vulnerability management:

- Continuous dependency monitoring.
- Monthly internal scans.
- Quarterly external scans.
- Annual penetration test.
- Remediation SLAs based on severity.

Incident response:

1. Detect.
2. Triage.
3. Contain.
4. Preserve evidence.
5. Notify legal, sponsor bank, and affected vendors.
6. Determine customer/regulator notification obligations.
7. Eradicate.
8. Recover.
9. Post-incident review.

Audit logging:

- Login/logout.
- MFA changes.
- Device changes.
- PII views.
- Account number/routing reveal.
- Card PAN reveal.
- Limit changes.
- Transaction actions.
- Admin searches.
- Case decisions.
- Account freezes/unfreezes.
- Data exports.

## 8. UX Direction

Velmont should feel like Apple Wallet simplicity, Amex trust, and Swiss private-bank restraint.

Visual system:

- Deep graphite / near-black base.
- Warm gold accent used sparingly for primary actions and value highlights.
- Clean ivory or mist surface for documents and web content.
- High contrast for accessibility.
- No crypto-like visuals, excessive glow, or fake luxury clutter.

Mobile navigation:

- Dashboard.
- Vault.
- Transfers.
- Card.
- Prive.

Key screens:

- Welcome / secure entry.
- Membership application.
- KYC capture.
- Dashboard with net cash, available balance, card, vaults, and recent activity.
- Velmont Vault list and detail.
- Transfer amount, recipient, review, authorize.
- Card controls.
- Prive secure concierge chat.
- Dispute intake.
- Profile and security center.

Tone:

- Precise, calm, confidential.
- Use "membership", "account", "vault", "secure review", "private support".
- Avoid unsupported phrases such as "guaranteed wealth", "sovereign", "asset protection", "investment returns", or "FDIC-insured by Velmont".

## 9. Admin Dashboard

Roles:

- Support Agent.
- Senior Support.
- KYC Analyst.
- AML Analyst.
- Fraud Analyst.
- Disputes Specialist.
- Compliance Manager.
- Operations Manager.
- Security Admin.
- Read-only Auditor.
- Super Admin, tightly restricted.

Modules:

- Customer 360.
- KYC queue.
- OFAC potential matches.
- AML alerts.
- Fraud alerts.
- Transaction search.
- Account freeze/unfreeze.
- ACH returns.
- Card disputes.
- Complaints.
- Reports and exports.
- Audit logs.
- Vendor webhook monitor.
- Reconciliation exceptions.

Permissions:

- Support can view basic profile and cases, not full SSN or full account number.
- KYC can view identity artifacts and approve/deny onboarding.
- AML can view transaction history and escalate cases.
- Fraud can freeze account/card under policy.
- Compliance manager can approve closures, SAR referrals, OFAC escalations, and high-risk decisions.
- Auditor has read-only access with export controls.

## 10. API Surface

Customer APIs:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/mfa/verify`
- `GET /me`
- `PATCH /me`
- `POST /onboarding/applications`
- `GET /onboarding/applications/{id}`
- `POST /kyc/sessions`
- `GET /accounts`
- `GET /accounts/{id}`
- `GET /accounts/{id}/balances`
- `GET /transactions`
- `GET /transactions/{id}`
- `POST /external-accounts/link-token`
- `POST /ach/transfers`
- `GET /ach/transfers/{id}`
- `POST /vaults`
- `GET /vaults`
- `POST /vaults/{id}/transfers`
- `GET /cards`
- `POST /cards/{id}/freeze`
- `POST /cards/{id}/unfreeze`
- `PATCH /cards/{id}/controls`
- `POST /disputes`
- `GET /disputes/{id}`
- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `POST /support/messages`
- `POST /account-closure-requests`

Admin APIs:

- `GET /admin/customers`
- `GET /admin/customers/{id}`
- `GET /admin/cases`
- `POST /admin/cases/{id}/assign`
- `POST /admin/cases/{id}/decision`
- `POST /admin/accounts/{id}/freeze`
- `POST /admin/accounts/{id}/unfreeze`
- `GET /admin/transactions`
- `GET /admin/reconciliation/exceptions`
- `POST /admin/reports/export`
- `GET /admin/audit-logs`

## 11. Roadmap

### First 3 Months, Week by Week

Week 1:

- Incorporate operating company.
- Retain fintech counsel.
- Finalize MVP scope and prohibited activities.
- Build sponsor bank target list.
- Start compliance policy drafts.

Week 2:

- Prepare sponsor bank/BaaS diligence package.
- Define product flows and disclosures inventory.
- Select initial architecture and cloud baseline.
- Draft risk assessment.

Week 3:

- Begin BaaS/sponsor outreach.
- Shortlist KYC, fraud, card, ACH, support, and monitoring vendors.
- Create data model and ledger design.
- Start brand and UX system.

Week 4:

- Choose preferred BaaS path.
- Draft onboarding PRD.
- Implement auth and user profile foundation.
- Create compliance committee cadence.

Week 5:

- Build onboarding application service.
- Integrate KYC sandbox.
- Draft CIP/KYC procedure.
- Draft GLBA privacy notice and security policy.

Week 6:

- Build admin KYC queue.
- Add audit logging foundation.
- Start ledger service.
- Draft fraud rules v1.

Week 7:

- Build account and balance screens.
- Integrate sponsor/BaaS sandbox account creation.
- Build compliance case service.
- Draft complaint handling procedure.

Week 8:

- Build ACH external account linking.
- Build transfer lifecycle.
- Draft NACHA operating procedures.
- Start vendor risk reviews.

Week 9:

- Build debit card issuing sandbox flow.
- Build card controls.
- Draft dispute procedure.
- Start SOC 2 readiness gap assessment.

Week 10:

- Build Velmont Vault.
- Build notifications.
- Reconciliation reports v1.
- Sponsor bank policy review.

Week 11:

- Internal alpha with test users.
- Fix onboarding and ledger defects.
- Complete initial compliance training.
- Tabletop incident response exercise.

Week 12:

- Sponsor bank readiness review.
- Closed beta launch plan.
- Finalize customer support scripts.
- Prepare launch risk memo and go/no-go checklist.

### 6-Month Milestones

- Sponsor bank/BaaS contract executed.
- MVP app complete.
- Compliance policies approved.
- Vendor stack integrated.
- Internal ledger reconciles daily.
- Closed beta approved by sponsor bank.
- SOC 2 Type I readiness underway.

### 12-Month Milestones

- Public launch in approved states/customer segments.
- SOC 2 Type II audit period completed or underway.
- PCI DSS scope validated.
- Mature fraud and AML monitoring.
- Additional sponsor bank resilience plan.
- Evaluate wealth/RIA partner expansion.

## 12. Launch Checklist

Legal:

- Entity formed.
- Founder agreements complete.
- Fintech counsel retained.
- Sponsor bank contract.
- BaaS/platform contracts.
- Card program agreement.
- ACH origination agreement.
- KYC/fraud/vendor agreements.
- Terms of service.
- Deposit account agreement from sponsor bank.
- Privacy policy.
- E-SIGN consent.
- Fee schedule.
- Funds availability disclosure.
- Debit cardholder agreement.
- Complaint policy.
- State MTL memo.

Compliance:

- AML policy.
- CIP/KYC policy.
- OFAC policy.
- SAR referral workflow.
- CTR support workflow if applicable.
- Fraud policy.
- Dispute policy.
- Complaint policy.
- Record retention schedule.
- Vendor risk management policy.
- Training logs.
- Independent testing plan.

Technology:

- Production AWS environment.
- CI/CD.
- Secrets management.
- Encryption.
- Logging and monitoring.
- Audit logging.
- Ledger service.
- Sponsor bank integration.
- KYC integration.
- Card integration.
- ACH integration.
- Admin dashboard.
- Reconciliation reports.
- Incident runbooks.

Operations:

- Support playbooks.
- KYC review staffing.
- Fraud review staffing.
- Dispute operations.
- Escalation matrix.
- Sponsor bank reporting cadence.
- Customer communication templates.
- Beta user controls.
- Go/no-go committee.

## 13. Brutal Reality

Hardest dependencies:

1. Sponsor bank approval and ongoing oversight.
2. Compliance program credibility.
3. Reconciliation and ledger accuracy.
4. Fraud losses and ACH return risk.
5. Dispute and complaint operations.
6. Vendor risk and platform dependency.
7. Security evidence for SOC 2 and sponsor diligence.
8. Capital runway for compliance, engineering, legal, and fraud reserves.

Fastest legal path:

Launch a narrow consumer DDA + debit + ACH + vault allocation product through a reputable sponsor/BaaS stack, with no investing, no lending, no crypto, no business accounts, no international wires, and no cash deposits at MVP. Use premium service and design as the differentiator, not regulatory complexity.

## 14. Primary Regulatory Sources to Track

- FDIC pass-through deposit insurance guidance and recordkeeping developments for third-party custodial accounts.
- FDIC/OCC/Federal Reserve interagency third-party risk management guidance.
- FinCEN BSA/AML requirements and MSB guidance.
- CFPB Regulation E and deposit account consumer protection resources.
- FTC GLBA Safeguards Rule.
- NACHA Operating Rules.
- PCI Security Standards Council PCI DSS v4.0.1.
- AICPA SOC 2 Trust Services Criteria.

