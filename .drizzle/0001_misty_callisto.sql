ALTER TABLE "challenges" ALTER COLUMN "timeout" SET DEFAULT extract(epoch from now()) + 60 * 5;
ALTER TABLE "challenges" ALTER COLUMN "timeout" SET NOT NULL;
ALTER TABLE "credentials" ALTER COLUMN "public_key" SET DATA TYPE text;
ALTER TABLE "credentials" ALTER COLUMN "public_key" SET NOT NULL;
ALTER TABLE "credentials" ALTER COLUMN "counter" SET NOT NULL;