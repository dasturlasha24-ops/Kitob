/**
 * Helper utilities for formatting and normalizing names.
 * Ensures initial letters are automatically capitalized as user types,
 * while supporting Uzbek Latin letters, apostrophes (', ‘, ’, `), hyphens, and compound names.
 */

/**
 * Automatically capitalizes the first letter of each word during live typing.
 * Doesn't change text length, ensuring smooth cursor movement without jumps.
 * 
 * Examples:
 *  "asadbek" -> "Asadbek"
 *  "karimov" -> "Karimov"
 *  "muhammad ali" -> "Muhammad Ali"
 *  "o'ktam" -> "O'ktam"
 *  "g'anisher" -> "G'anisher"
 *  "nur-sulton" -> "Nur-Sulton"
 */
export function formatNameInput(value: string): string {
  if (!value) return "";
  return value.replace(/(^|[\s-])(\p{L})/gu, (_, prefix, char) => prefix + char.toUpperCase());
}

/**
 * Cleans and finalizes names onBlur or before saving to database.
 * Normalizes all-caps input (e.g. "ASADBEK" -> "Asadbek") and trims extra whitespace.
 */
export function formatNameFinal(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/\s+/)
    .map((word) => {
      return word
        .split("-")
        .map((part) => {
          if (!part) return "";
          const lettersOnly = part.replace(/[^\p{L}]/gu, "");
          // If word was entered in ALL CAPS, normalize to Title Case
          if (lettersOnly.length > 1 && lettersOnly === lettersOnly.toUpperCase()) {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          }
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join("-");
    })
    .join(" ");
}
