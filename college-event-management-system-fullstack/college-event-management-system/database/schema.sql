CREATE DATABASE IF NOT EXISTS college_events;
USE college_events;
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  venue VARCHAR(150) NOT NULL,
  category VARCHAR(80) DEFAULT 'General',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  student_name VARCHAR(120) NOT NULL,
  student_email VARCHAR(190) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_event_student (event_id, student_email),
  CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
INSERT INTO events (title, description, event_date, venue, category)
SELECT 'Tech Fest 2026', 'A day of coding, demos, and technology talks.', '2026-11-12 10:00:00', 'Main Auditorium', 'Technology'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title='Tech Fest 2026');
INSERT INTO events (title, description, event_date, venue, category)
SELECT 'Cultural Night', 'Celebrate music, dance, and campus creativity.', '2026-11-20 17:00:00', 'Open Air Stage', 'Cultural'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title='Cultural Night');
