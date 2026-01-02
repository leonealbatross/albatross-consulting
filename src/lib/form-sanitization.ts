import { z } from "zod";

/**
 * Sanitizes a string to prevent email header injection attacks.
 * Removes newline characters, carriage returns, and other control characters
 * that could be used to inject additional email headers.
 */
export const sanitizeForEmail = (input: string): string => {
  if (!input) return "";
  
  // Remove carriage returns, newlines, and other control characters
  // that could be used for header injection
  return input
    .replace(/[\r\n\t\x00-\x1F\x7F]/g, " ") // Replace control chars with space
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
};

/**
 * Sanitizes a multi-line string (like message body) while preserving
 * intentional line breaks but preventing injection attacks.
 */
export const sanitizeMultilineForEmail = (input: string): string => {
  if (!input) return "";
  
  // Replace potentially dangerous characters but keep legitimate newlines
  return input
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n") // Convert remaining CR to LF
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control chars except \n and \t
    .trim();
};

/**
 * Zod schema for contact form validation with length limits
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .transform(sanitizeForEmail),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .transform(sanitizeForEmail),
  company: z
    .string()
    .max(200, "Company name must be less than 200 characters")
    .optional()
    .transform((val) => (val ? sanitizeForEmail(val) : "")),
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters")
    .transform(sanitizeMultilineForEmail),
});

/**
 * Zod schema for careers form validation with length limits
 */
export const careersFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .transform(sanitizeForEmail),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .transform(sanitizeForEmail),
  phone: z
    .string()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .transform((val) => (val ? sanitizeForEmail(val) : "")),
  linkedin: z
    .string()
    .max(200, "LinkedIn URL must be less than 200 characters")
    .optional()
    .transform((val) => (val ? sanitizeForEmail(val) : "")),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be less than 2000 characters")
    .transform(sanitizeMultilineForEmail),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CareersFormData = z.infer<typeof careersFormSchema>;
