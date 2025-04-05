CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- 'income' or 'expense'
  "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "transactions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "type" TEXT NOT NULL, -- 'income' or 'expense'
  "category_id" INTEGER,
  "description" TEXT,
  "date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Add default categories
INSERT INTO "categories" ("user_id", "name", "type") VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Salary', 'income'),
  ('00000000-0000-0000-0000-000000000000', 'Freelance', 'income'),
  ('00000000-0000-0000-0000-000000000000', 'Other Income', 'income'),
  ('00000000-0000-0000-0000-000000000000', 'Rent', 'expense'),
  ('00000000-0000-0000-0000-000000000000', 'Groceries', 'expense'),
  ('00000000-0000-0000-0000-000000000000', 'Utilities', 'expense'),
  ('00000000-0000-0000-0000-000000000000', 'Transportation', 'expense'),
  ('00000000-0000-0000-0000-000000000000', 'Entertainment', 'expense'),
  ('00000000-0000-0000-0000-000000000000', 'Other Expense', 'expense');