/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  STUDEX — Configuration File                                 ║
 * ║  studex.config.js                                            ║
 * ║                                                              ║
 * ║  Place this file in the SAME folder as studex.html           ║
 * ║  Fill in all three sections below, then reload the app.      ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  SETUP CHECKLIST
 *  ───────────────
 *  □ 1. Create a free Supabase project at https://supabase.com
 *  □ 2. Run schema.sql in Supabase → SQL Editor → New Query
 *  □ 3. Copy your Project URL + anon key → paste below
 *  □ 4. Create a free Cloudinary account at https://cloudinary.com
 *  □ 5. Create an unsigned upload preset in Cloudinary → Settings →
 *        Upload → Upload Presets → Add upload preset
 *        (set Signing mode = Unsigned, folder = studex)
 *  □ 6. Copy your Cloud Name + preset name → paste below
 *  □ 7. Open studex.html in your browser — done!
 */

window.STUDEX_CONFIG = {

  /* ────────────────────────────────────────────────────────
     SUPABASE — Database & Backend
     ────────────────────────────────────────────────────────
     Find these at:
       Supabase dashboard → Your Project → Settings → API

     Project URL looks like:
       https://abcdefghijklmnop.supabase.co

     Anon (public) key is a long JWT string starting with "eyJ..."
     It is SAFE to expose in client-side code.
  ──────────────────────────────────────────────────────────── */
  supabaseUrl:  'https://mclpfjyrpdyngqmxcwwe.supabase.co',
  supabaseAnon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbHBmanlycGR5bmdxbXhjd3dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NzY2ODAsImV4cCI6MjA5NDM1MjY4MH0.2T3f1IgBRddMllXQrjjuA-3do8bAUEKXN9QtvwSZOSA',


  /* ────────────────────────────────────────────────────────
     CLOUDINARY — Image Hosting
     ────────────────────────────────────────────────────────
     Used for:
       • Journal polaroid photos    → stored as secure_url in
         studex_journal.photos[].dataUrl
       • Vision board images        → stored as secure_url in
         studex_vision_board.img_data

     If you leave these as placeholder values, the app will
     fall back to compressing images as base64 data URIs and
     storing them directly in Supabase (works fine for a few
     photos; not recommended for large collections).

     Find your Cloud Name at:
       Cloudinary dashboard → top-left of any page

     Upload preset:
       Cloudinary → Settings → Upload → Upload Presets
       → Add upload preset → set Signing mode = Unsigned
       → set Folder = studex  (optional but keeps things tidy)
       → save → copy the preset name
  ──────────────────────────────────────────────────────────── */
  cloudinaryCloud:  'dlygqn0vk',
  cloudinaryPreset: 'studex',

};


/**
 * ══════════════════════════════════════════════════════════════
 *  HOW THE DATA FLOWS
 * ══════════════════════════════════════════════════════════════
 *
 *  JOURNAL PHOTOS
 *  ──────────────
 *  When a user uploads a photo to the Journal tab:
 *
 *    1. uploadImage(file) is called.
 *    2. If Cloudinary is configured → uploads to Cloudinary,
 *       returns a secure_url like:
 *         https://res.cloudinary.com/<cloud>/image/upload/v.../studex/abc123.jpg
 *    3. That URL is stored in the photos[] array on the journal
 *       entry row:
 *         studex_journal.photos = JSON.stringify([
 *           { id: "abc", dataUrl: "https://res.cloudinary.com/...", caption: "My desk" },
 *           ...
 *         ])
 *    4. The <img> tag in the polaroid renders src = the URL.
 *       Caption text, rotation CSS, and font size are all
 *       rendered client-side from the stored JSON — they do NOT
 *       need separate columns because they are part of the
 *       photo object serialised in the JSONB field.
 *
 *  NOTE: The polaroid rotation (nth-child CSS) is purely
 *  presentational and is NOT stored — it is deterministic
 *  from the photo's index position in the array.
 *
 *  VISION BOARD PHOTOS
 *  ────────────────────
 *  Each vision board item is a separate row in studex_vision_board:
 *    • img_data  → Cloudinary secure_url (or base64 fallback)
 *    • caption   → editable caption text
 *    • x, y      → absolute pixel position (saved on mouseup after drag)
 *    • rot       → rotation in degrees (set randomly on upload, saved)
 *    • font_size → caption font size in px (8–22, saved on A+/A− click)
 *
 *  Every one of these fields is written to Supabase immediately
 *  on change (drag end, blur, font button click).
 *
 *  DEMO MODE (no config)
 *  ──────────────────────
 *  If supabaseUrl is still 'YOUR_PROJECT_URL_HERE', the app runs
 *  in demo mode: an in-memory stub replaces Supabase. All features
 *  work but data resets on page reload. Images use base64 fallback.
 *
 * ══════════════════════════════════════════════════════════════
 *
 *  TABLE SUMMARY (all tables created by schema.sql)
 * ──────────────────────────────────────────────────────────────
 *  studex_checked        chapter_id, checked_at
 *  studex_rev_done       rev_id
 *  studex_difficulty     chapter_id, difficulty
 *  studex_notes          chapter_id, note
 *  studex_con_config     key, value
 *  studex_con_boxes      date, status
 *  studex_questions      id, count, subject, type, logged_at
 *  studex_mocks          id, name, type, max_marks, obtained,
 *                        maths, physics, chemistry, pct,
 *                        test_date, notes, added_at
 *  studex_journal        id, title, body, mood, tags (jsonb),
 *                        photos (jsonb), entry_date, updated_at
 *  studex_notes_v1       id, title, body, note_type, checklist (jsonb),
 *                        color, labels (jsonb), pinned, archived,
 *                        created_at, updated_at
 *  studex_profile        key, value
 *  studex_vision_board   id, img_data, caption, x, y, rot,
 *                        font_size, created_at
 * ══════════════════════════════════════════════════════════════
 */
