# Chari-T-Croud-funding-application-

Chari-T is a purpose-built digital platform designed to bridge the gap between compassionate individuals and verified charity organizations. At its core, the app serves as a centralized hub where users can discover, engage with, and contribute to meaningful social impact initiatives — all from a single, intuitive interface.

## Features

- User authentication & role management (donor/admin)
- KYC verification system
- Campaign creation & management
- Donation processing (Paystack + server-side verification)
- Center/organization verification
- Reporting system
- Safety ratings for campaigns
- Optional tips only (no platform cut on gifts)
- Blind / anonymous-to-fundraiser donations

## Product idea (hackathon)

Chari-T is a **trust-first** crowdfunding platform: donors discover causes and verified charity centers, fundraisers pass bank + KYC checks, and campaigns carry **safety ratings** driven by verification and community reports.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind, Cloudinary
- **Backend:** Next.js API routes, TypeScript
- **Database:** MySQL + Upstash Redis
- **Payments:** Paystack (subaccounts + tips)

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

```bash
git clone https://github.com/ayoolaowoilu/Chari-T-Croud-funding-application-.git
cd Chari-T-Croud-funding-application-
npm install
```

### Enviroment variables

### .env(ill drop the testKeys if ur intrested)
```bash

GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET = ""
DB_HOST = localhost
DB_USER = root
DB_PASSWORD = "khaleed"
DB_PORT = "3306"
DB_DATABASE = "charit"
CLOUDINARY_CLOUD_NAME = ""
CLOUDINARY_API_KEY = ""
CLOUDINARY_API_SECRET = ""
API_URL = "http://localhost:3000"
# Prefer PAYSTACK_SECRET_KEY (server-only). NEXT_PUBLIC_ is supported for legacy demos only.
PAYSTACK_SECRET_KEY = "sk_test_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = "pk_test_..."
PAYSTACK_APP_URL ="https://api.paystack.co"

```
### .env.local
```bash
NEXTAUTH_URL = http://localhost:3000
NEXTAUTH_SECRET = "jijsijijejijje jijjfjjjefeeff"
 ```


### Database Setup
Run the following SQL to create the required tables(MySql):
```bash
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    role ENUM('donor', 'admin') DEFAULT 'donor',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image text,
    method varchar(255),
    donations INT DEFAULT 0,
    recieved INT DEFAULT 0,
    bank_details JSON 
);

CREATE TABLE kyc (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    document_type ENUM('NIN', 'BVN', 'DRIVERS_LICENSE', 'PASSPORT', 'VOTERS_CARD') NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    document_public_id VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL
);

CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_from INT DEFAULT NULL,
    to_user_or_centerId INT NOT NULL,
    _to ENUM("normal","center") DEFAULT "normal",
    ammount INT,
    name VARCHAR(255),
    time_donated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id TEXT
);

CREATE TABLE transactions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    refrence VARCHAR(255),
    ammount INT,
    payer_id INT DEFAULT NULL,
    paid_to ENUM("normal","center") DEFAULT "normal"
);

CREATE TABLE centers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    email VARCHAR(150),
    phone VARCHAR(20),
    address VARCHAR(255),
    website VARCHAR(255),
    is_verified_status ENUM('pending', 'checking', 'verified', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    about TEXT,
    logourl VARCHAR(500),
    user_id INT,
    geo_location VARCHAR(255),
    verification_documents JSON,
    bank_details JSON
);

CREATE TABLE campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    details TEXT,
    story TEXT,
    main_img JSON,
    imgs JSON,
    donors JSON,
    goal INT,
    raised INT DEFAULT 0,
    _type ENUM('normal', 'center') DEFAULT 'normal',
    center_name VARCHAR(255),
    center_id VARCHAR(255),
    user_id INT,
    date_to_completion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    currency ENUM("NG", "USD", "EURO") NOT NULL,
    category ENUM("Education","Community","CroudFunding","Business","Health") DEFAULT "croudFunding",
    donation_count int DEFAULT 0,
    location VARCHAR(255),
    bank_details JSON,
    safety_rating ENUM('verified_safe','likely_safe','uncertain','likely_risky','unsafe') DEFAULT 'uncertain',
    reported BOOLEAN
);

CREATE TABLE reports (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT UNSIGNED NOT NULL,
    reporter_name VARCHAR(255),
    report_type ENUM('fraud', 'misrepresentation', 'exploitative', 'spam') NOT NULL,
    meaasge TEXT,
    status ENUM('pending', 'investigating', 'resolved', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
### Running 
 ```bash
 pnpm install
 pnpm dev
```

### Demo walkthrough (for presentations)

1. **Landing** — `/` — mission, featured causes, blind-donation pitch, zero-fee story  
2. **How it works** — `/how-it-works` — safety tiers + start-a-cause steps  
3. **Browse** — `/causes/get` — filter by category  
4. **Sign in** — Google / X  
5. **Bank + KYC** — required before publishing a cause  
6. **Start a cause** — `/startcauses` — multi-step wizard with drafts  
7. **Donate** — open a cause → Donate → optional tip → Paystack test card  
8. **Local centers** — `/dashboard/centers/local-centers`  
9. **Admin** — `/admin` (user `role` must be `admin` in MySQL)

### Schema upgrades (existing DBs)

```sql
ALTER TABLE centers ADD COLUMN total_donators INT DEFAULT 0;
ALTER TABLE centers ADD COLUMN total_campaigns INT DEFAULT 0;
-- Promote a demo admin:
-- UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

### Demo seed campaigns

```bash
# After tables exist:
mysql -u root -p charit < scripts/demo-seed.sql
```

Creates `demo@chari-t.local` + 3 sample campaigns with local images so browse/donate UI looks full during presentations.  
**Note:** Live Paystack still needs a real subaccount code on the campaign/user bank details.

### Paystack webhook (recommended)

In Paystack Dashboard → Settings → Webhooks:

`https://<your-domain>/api/webhooks/paystack`

Events: `charge.success`. Uses HMAC `x-paystack-signature` + the same verified recording path as the client callback.

