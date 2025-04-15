/**
 * Generates a unique label for the GitHub runner.
 *
 * @returns A unique label string.
 */
export function generateLabel(): string {
  return Math.random().toString(36).substring(2, 7);
}
