/*
 * CLI utility for provisioning an initial admin account in Supabase environments.
 * Standardizes local bootstrap steps so team setup remains predictable and repeatable.
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const raw = fs.readFileSync(filePath, "utf8");
  const result = {};

  raw.split("\n").forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) return;

    const index = trimmed.indexOf("=");
    if (index === -1) return;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");

    result[key] = value;
  });

  return result;
}

const envFromFile = loadEnvFile(path.resolve(process.cwd(), ".env.admin"));

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  envFromFile.SUPABASE_URL ||
  envFromFile.VITE_SUPABASE_URL;

const SUPABASE_ADMIN_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  envFromFile.SUPABASE_SERVICE_ROLE_KEY ||
  envFromFile.SUPABASE_SECRET_KEY;

const HAS_ANON_KEY =
  Boolean(process.env.VITE_SUPABASE_ANON_KEY) ||
  Boolean(process.env.SUPABASE_ANON_KEY) ||
  Boolean(envFromFile.VITE_SUPABASE_ANON_KEY) ||
  Boolean(envFromFile.SUPABASE_ANON_KEY);

const [email, password, fullName = "System Admin", role = "system_admin"] =
  process.argv.slice(2);

const missingEnv = [];

if (!SUPABASE_URL) missingEnv.push("SUPABASE_URL");
if (!SUPABASE_ADMIN_KEY) missingEnv.push("SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY");

if (missingEnv.length) {
  console.error(`Missing ${missingEnv.join(" and ")}. Add them to .env.admin or your terminal env.`);
  if (HAS_ANON_KEY && !SUPABASE_ADMIN_KEY) {
    console.error(
      "Found an anon/publishable key, but admin creation requires a Supabase admin key."
    );
  }
  process.exit(1);
}

if (
  SUPABASE_ADMIN_KEY.startsWith("sb_publishable_") ||
  SUPABASE_ADMIN_KEY.startsWith("sb_public_")
) {
  console.error(
    "The configured admin key is actually a publishable client key. Use SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY from Supabase Project Settings > API Keys."
  );
  process.exit(1);
}

if (!email || !password) {
  console.error(
    'Usage: node tools/create-admin.mjs "admin@example.com" "StrongPass123!" "Full Name" "system_admin"'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function findAuthUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    const users = data?.users || [];
    const found = users.find(
      (user) => String(user.email || "").toLowerCase() === targetEmail.toLowerCase()
    );

    if (found) return found;
    if (users.length < perPage) return null;

    page += 1;
  }
}

async function getOrCreateAuthUser() {
  const existing = await findAuthUserByEmail(email);
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error) throw error;
  return data.user;
}

async function upsertPublicUser(userId) {
  const payload = {
    id: userId,
    email,
    full_name: fullName,
    role,
    status: "active",
  };

  const { error } = await supabase.from("users").upsert(payload, {
    onConflict: "id",
  });

  if (error) throw error;
}

async function main() {
  try {
    const authUser = await getOrCreateAuthUser();
    await upsertPublicUser(authUser.id);

    console.log("Admin ready.");
    console.log(`Email: ${email}`);
    console.log(`Full name: ${fullName}`);
    console.log(`Role: ${role}`);
    console.log(`User id: ${authUser.id}`);
  } catch (error) {
    console.error("Failed to create admin:");
    console.error(error?.message || error);
    process.exit(1);
  }
}

main();
