-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" BIGSERIAL NOT NULL,
    "note_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_shares" (
    "id" BIGSERIAL NOT NULL,
    "note_id" BIGINT NOT NULL,
    "shared_to_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "note_shares_note_id_shared_to_id_key" ON "note_shares"("note_id", "shared_to_id");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_shares" ADD CONSTRAINT "note_shares_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_shares" ADD CONSTRAINT "note_shares_shared_to_id_fkey" FOREIGN KEY ("shared_to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- CreateView: view_public_notes
CREATE OR REPLACE VIEW "view_public_notes" AS
SELECT
    n.id,
    n.title,
    n.content,
    u.name
FROM "notes" n
JOIN "users" u ON n.user_id = u.id
WHERE n.is_public = TRUE;

-- CreateView: view_shared_notes
CREATE OR REPLACE VIEW "view_shared_notes" AS
SELECT
    ns.id AS shared_note_id,
    ns.note_id,
    ns.shared_to_id,
    shared_to.email AS shared_to_email,
    shared_to.name AS shared_to_name,
    n.user_id AS shared_by_user_id,
    shared_by.name AS shared_by_name,
    shared_by.email AS shared_by_email,
    n.title,
    n.content
FROM "note_shares" ns
JOIN "notes" n ON ns.note_id = n.id
JOIN "users" shared_to ON ns.shared_to_id = shared_to.id
JOIN "users" shared_by ON n.user_id = shared_by.id;

-- CreateView: view_user_notes
CREATE OR REPLACE VIEW "view_user_notes" AS
SELECT
    n.id AS note_id,
    n.user_id,
    u.email AS user_email,
    u.name AS user_name,
    n.title,
    n.content,
    n.created_at,
    n.updated_at
FROM "notes" n
JOIN "users" u ON n.user_id = u.id;