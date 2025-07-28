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