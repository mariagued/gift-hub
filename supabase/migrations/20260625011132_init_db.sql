-- Create USER table
CREATE TABLE "USER" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "avatarUrl" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create GROUP table
CREATE TABLE "GROUP" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "eventDate" TIMESTAMP WITH TIME ZONE,
    "budgetLimit" NUMERIC(10, 2),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create PARTICIPANT table
CREATE TABLE "PARTICIPANT" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "groupId" UUID NOT NULL REFERENCES "GROUP"("id") ON DELETE CASCADE,
    "userId" UUID NOT NULL REFERENCES "USER"("id") ON DELETE CASCADE,
    "role" VARCHAR(50) DEFAULT 'MEMBER' CHECK ("role" IN ('ADMIN', 'MEMBER')),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE("groupId", "userId")
);

-- Create WISH table
CREATE TABLE "WISH" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "USER"("id") ON DELETE CASCADE,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create DRAW table
CREATE TABLE "DRAW" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "groupId" UUID NOT NULL REFERENCES "GROUP"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create PAIR table
CREATE TABLE "PAIR" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "drawId" UUID NOT NULL REFERENCES "DRAW"("id") ON DELETE CASCADE,
    "giverId" UUID NOT NULL REFERENCES "PARTICIPANT"("id") ON DELETE CASCADE,
    "receiverId" UUID NOT NULL REFERENCES "PARTICIPANT"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE("drawId", "giverId")
);

-- Create indexes for performance on foreign keys
CREATE INDEX idx_participant_group ON "PARTICIPANT"("groupId");
CREATE INDEX idx_participant_user ON "PARTICIPANT"("userId");
CREATE INDEX idx_wish_user ON "WISH"("userId");
CREATE INDEX idx_draw_group ON "DRAW"("groupId");
CREATE INDEX idx_pair_draw ON "PAIR"("drawId");
CREATE INDEX idx_pair_giver ON "PAIR"("giverId");
CREATE INDEX idx_pair_receiver ON "PAIR"("receiverId");
