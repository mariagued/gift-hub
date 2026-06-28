-- Enable Row Level Security (RLS) on all tables
ALTER TABLE "USER" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GROUP" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PARTICIPANT" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WISH" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DRAW" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PAIR" ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated" ON "USER"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON "GROUP"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON "PARTICIPANT"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON "WISH"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON "DRAW"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated" ON "PAIR"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
