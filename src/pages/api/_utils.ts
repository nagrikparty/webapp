import { logger } from "@/lib/logger";

export async function verifyTurnstile(token: string, env: any): Promise<boolean> {
  try {
    const secretKey = env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) return false;
    
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    });

    const outcome = await result.json() as any;
    return !!outcome.success;
  } catch (error) {
    logger.error({ err: error }, "Turnstile verification error");
    return false;
  }
}

export async function validateFileUpload(file: File, maxSizeMB: number = 5): Promise<{ valid: boolean; error?: string }> {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' };
  }
  return { valid: true };
}
