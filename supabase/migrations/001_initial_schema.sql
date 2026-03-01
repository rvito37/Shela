-- Shela Portal: Initial Schema
-- Enum types
CREATE TYPE content_type AS ENUM ('article', 'quick_take', 'list', 'qa', 'column');
CREATE TYPE article_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- Personas (AI columnists)
CREATE TABLE personas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  name_en       text NOT NULL,
  slug          text UNIQUE NOT NULL,
  bio           text,
  avatar_url    text,
  style_prompt  text,
  ai_model      text DEFAULT 'claude-sonnet-4-6',
  rubric_name   text NOT NULL,
  rubric_slug   text NOT NULL,
  is_active     boolean DEFAULT true,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Articles
CREATE TABLE articles (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id            uuid REFERENCES personas(id) ON DELETE SET NULL,
  title                 text NOT NULL,
  slug                  text UNIQUE NOT NULL,
  excerpt               text,
  content               text,
  content_type          content_type DEFAULT 'article',
  cover_image_url       text,
  seo_title             text,
  seo_description       text,
  status                article_status DEFAULT 'draft',
  published_at          timestamptz,
  scheduled_for         timestamptz,
  ai_model_used         text,
  generation_prompt     text,
  word_count            int DEFAULT 0,
  reading_time_minutes  int DEFAULT 0,
  view_count            int DEFAULT 0,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL,
  slug  text UNIQUE NOT NULL
);

-- Article-Tag junction
CREATE TABLE article_tags (
  article_id  uuid REFERENCES articles(id) ON DELETE CASCADE,
  tag_id      uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Subscribers
CREATE TABLE subscribers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text UNIQUE NOT NULL,
  name                text,
  subscribed_rubrics  text[],
  is_active           boolean DEFAULT true,
  created_at          timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_articles_persona ON articles(persona_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_personas_slug ON personas(slug);
CREATE INDEX idx_personas_rubric_slug ON personas(rubric_slug);

-- RLS Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active personas"
  ON personas FOR SELECT
  USING (is_active = true);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read tags"
  ON tags FOR SELECT
  USING (true);

ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read article_tags"
  ON article_tags FOR SELECT
  USING (true);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- No public read on subscribers
