# Chari-T-Croud-funding-application-

Chari-T is a purpose-built digital platform designed to bridge the gap between compassionate individuals and verified charity organizations. At its core, the app serves as a centralized hub where users can discover, engage with, and contribute to meaningful social impact initiatives — all from a single, intuitive interface.

## Tech Stack

- **Frontend:** Next.js, React
- **Database:** MySQL , redis ,Serverless 

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

###Enviroment variables
##.env(ill drop the testKeys if ur intrested)
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
NEXT_PUBLIC_PAYSTACK_SECRET_KEY = "sk_test_df293748288b83367301d9b9f68a3fd7582a0e37"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY = "pk_test_a3556b84fe1c7b8fab91df5491aff03c0c9ac2e0"
PAYSTACK_APP_URL ="https://api.paystack.co"

##.env.local
NEXTAUTH_URL = http://localhost:3000
NEXTAUTH_SECRET = "jijsijijejijje jijjfjjjefeeff"


###Database Setup
Run the following SQL to create the required tables:

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


###Running 
npm run dev

