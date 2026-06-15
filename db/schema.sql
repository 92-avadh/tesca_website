-- Cloudflare D1 / SQLite Database Schema Definition

-- 1. Universities Table
DROP TABLE IF EXISTS universities;
CREATE TABLE universities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    code TEXT NOT NULL,
    rank INTEGER NOT NULL,
    domain TEXT NOT NULL,
    city TEXT NOT NULL,
    established INTEGER NOT NULL,
    students TEXT NOT NULL,
    tuition_fee_min REAL,
    tuition_fee_max REAL,
    min_gpa_percent REAL,
    min_ielts REAL,
    min_toefl INTEGER,
    highlights TEXT -- Additional details such as intakes, top courses, etc.
);

-- 2. Success Stories Table
DROP TABLE IF EXISTS success_stories;
CREATE TABLE success_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    destination TEXT NOT NULL,
    dest_flag TEXT NOT NULL,
    before_loc TEXT NOT NULL,
    before_status TEXT NOT NULL,
    before_ielts TEXT NOT NULL,
    after_uni TEXT NOT NULL,
    after_status TEXT NOT NULL,
    after_salary TEXT NOT NULL,
    quote TEXT NOT NULL,
    timeline TEXT NOT NULL -- JSON array string of milestones, e.g. '["Step 1", "Step 2"]'
);

-- 3. Leads Table
DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    academic_score REAL,
    ielts_score REAL,
    budget REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
