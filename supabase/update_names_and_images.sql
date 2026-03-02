-- Update persona names with last names (Ashkenazi + Sephardi mix)
UPDATE personas SET name = 'נועה גולדשטיין', name_en = 'Noa Goldstein' WHERE slug = 'noa';
UPDATE personas SET name = 'תמר אזולאי', name_en = 'Tamar Azoulay' WHERE slug = 'tamar';
UPDATE personas SET name = 'יעל פרידמן', name_en = 'Yael Friedman' WHERE slug = 'yael';
UPDATE personas SET name = 'שירה מזרחי', name_en = 'Shira Mizrahi' WHERE slug = 'shira';
UPDATE personas SET name = 'דנה כהן', name_en = 'Dana Cohen' WHERE slug = 'dana';
UPDATE personas SET name = 'מיכל לוינסון', name_en = 'Michal Levinson' WHERE slug = 'michal';
UPDATE personas SET name = 'אביגיל בן-שמעון', name_en = 'Avigail Ben-Shimon' WHERE slug = 'avigail';

-- Update cover images with reliable Unsplash photo IDs (full URL format)
-- Noa — Culture
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=900&h=600&fit=crop' WHERE slug = 'reality-tv-guilty-pleasure';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&h=600&fit=crop' WHERE slug = 'things-only-israeli-women-understand';

-- Tamar — Relationships
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=900&h=600&fit=crop' WHERE slug = 'how-to-know-hes-the-one';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=900&h=600&fit=crop' WHERE slug = 'letter-to-woman-who-stayed-too-long';

-- Yael — Motherhood
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=900&h=600&fit=crop' WHERE slug = 'what-they-didnt-tell-me-about-motherhood';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1484665754804-74b091211472?w=900&h=600&fit=crop' WHERE slug = 'types-of-moms-in-whatsapp-group';

-- Shira — Spirituality
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&h=600&fit=crop' WHERE slug = 'how-shabbat-saved-my-sanity';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=900&h=600&fit=crop' WHERE slug = 'one-verse-that-changes-your-day';

-- Dana — Beauty & Fashion
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=600&fit=crop' WHERE slug = 'spring-2026-fashion-trends';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&h=600&fit=crop' WHERE slug = 'skincare-products-worth-every-shekel';

-- Michal — Career
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=600&fit=crop' WHERE slug = 'why-you-should-ask-for-a-raise';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=600&fit=crop' WHERE slug = 'money-mistakes-young-women-make';

-- Avigail — Food
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1540914124281-342587941389?w=900&h=600&fit=crop' WHERE slug = 'grandmas-hummus-secret';
UPDATE articles SET cover_image_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&h=600&fit=crop' WHERE slug = 'shabbat-table-30-minutes';
