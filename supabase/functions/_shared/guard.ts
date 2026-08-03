// Shared request guards for public edge functions.
// Caps request size and validates untrusted input before it reaches paid APIs.

export class GuardError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const DEFAULT_MAX_BYTES = 32 * 1024; // 32 KB

export async function readJsonBody<T = unknown>(
  req: Request,
  maxBytes: number = DEFAULT_MAX_BYTES,
): Promise<T> {
  const declared = req.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) {
    throw new GuardError("Request body too large", 413);
  }

  const raw = await req.text();
  if (raw.length > maxBytes) {
    throw new GuardError("Request body too large", 413);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new GuardError("Invalid JSON body");
  }
}

export function requireString(
  value: unknown,
  field: string,
  maxLength: number,
  minLength = 1,
): string {
  if (typeof value !== "string") {
    throw new GuardError(`${field} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    throw new GuardError(`${field} is required`);
  }
  if (trimmed.length > maxLength) {
    throw new GuardError(`${field} must be at most ${maxLength} characters`);
  }
  return trimmed;
}

export function requireArray<T>(
  value: unknown,
  field: string,
  maxItems: number,
): T[] {
  if (!Array.isArray(value)) {
    throw new GuardError(`${field} must be an array`);
  }
  if (value.length > maxItems) {
    throw new GuardError(`${field} must contain at most ${maxItems} items`);
  }
  return value as T[];
}

// Allow-list for storage object names / cache keys: lowercase alphanumerics + underscore.
const PROMPT_KEY_PATTERN = /^[a-z0-9_]{1,120}$/;

export function requirePromptKey(value: unknown, field = "promptKey"): string {
  if (typeof value !== "string" || !PROMPT_KEY_PATTERN.test(value)) {
    throw new GuardError(
      `${field} must be 1-120 characters of lowercase letters, numbers or underscores`,
    );
  }
  return value;
}

export function guardResponse(error: unknown, corsHeaders: Record<string, string>) {
  if (error instanceof GuardError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return null;
}
