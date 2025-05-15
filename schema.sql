CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  profession VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  task_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  task_description TEXT NOT NULL,
  due_time TIMESTAMP,
  is_fixed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminders (
  reminder_id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(task_id),
  reminder_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);