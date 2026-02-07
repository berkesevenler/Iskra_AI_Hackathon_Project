import { createClient } from "@supabase/supabase-js";

// ============================================
// 🗄️ Supabase Client - Database & Auth
// ============================================
// Setup: https://supabase.com/dashboard
// 1. Create a new project
// 2. Copy URL and anon key to .env.local
// 3. Create tables in SQL editor

// Client-side Supabase client (for use in components)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Server-side Supabase client with service role (for API routes)
export function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

// ============================================
// 📝 CRUD Helper Functions
// ============================================

/**
 * Fetch all rows from a table
 * @param {string} table - Table name
 * @param {object} options - { orderBy, ascending, limit }
 */
export async function fetchAll(table, options = {}) {
  const { orderBy = "created_at", ascending = false, limit = 100 } = options;

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(orderBy, { ascending })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Fetch a single row by ID
 * @param {string} table - Table name
 * @param {string} id - Row ID
 */
export async function fetchById(table, id) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Insert a new row
 * @param {string} table - Table name
 * @param {object} row - Data to insert
 */
export async function insertRow(table, row) {
  const { data, error } = await supabase
    .from(table)
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a row by ID
 * @param {string} table - Table name
 * @param {string} id - Row ID
 * @param {object} updates - Fields to update
 */
export async function updateRow(table, id, updates) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a row by ID
 * @param {string} table - Table name
 * @param {string} id - Row ID
 */
export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw error;
  return true;
}

/**
 * Query rows with filters
 * @param {string} table - Table name
 * @param {object} filters - { column: value } pairs
 */
export async function queryRows(table, filters = {}) {
  let query = supabase.from(table).select("*");

  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
