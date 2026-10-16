
CREATE DATABASE IF NOT EXISTS fortuna CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fortuna;

CREATE TABLE IF NOT EXISTS team_members (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  role       VARCHAR(150) NOT NULL,
  photo_url  VARCHAR(255) NULL,            
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO team_members (name, role, sort_order) VALUES
  ('Brenda Mendes',  'General Manager', 1),
  ('Anabel Snyman',  'Stimulation Teacher', 2),
  ('Elsie Nhlapo',   'Cleaning and Laundry Manager', 3),
  ('Joannah Quimba', 'House Mother and Caregiver Manager', 4);
