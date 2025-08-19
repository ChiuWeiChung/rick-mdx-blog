CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  cover_path VARCHAR,
  icon_path VARCHAR
);

CREATE TABLE portfolios (
  id           SERIAL PRIMARY KEY,
  project_name VARCHAR NOT NULL,
  github_url   VARCHAR NOT NULL,
  readme_url   VARCHAR NOT NULL,
  start_date   DATE NOT NULL,
  end_date     DATE,
  cover_path   VARCHAR,
  description  TEXT
);

CREATE TABLE post_memos (
  id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(id) ON DELETE CASCADE,
  block_id VARCHAR,
  start_offset INT,
  end_offset INT,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  selected_content TEXT
);

CREATE TABLE post_tags (
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INT NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR NOT NULL,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  visible     BOOLEAN NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  category_id INT DEFAULT 1 REFERENCES categories(id) ON DELETE SET DEFAULT,
  file_path   VARCHAR,
  description TEXT
);

CREATE TABLE profile_config (
  id           INT PRIMARY KEY DEFAULT 1,
  profile_path VARCHAR NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR,
  email VARCHAR,
  provider VARCHAR,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, email)
);