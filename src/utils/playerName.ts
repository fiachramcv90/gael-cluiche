/**
 * Player name storage utilities
 */

export const PLAYER_NAME_KEY = 'gael-cluiche-player-name';

/**
 * Get the player's name from localStorage
 * @returns The player's name, or null if not set
 */
export function getPlayerName(): string | null {
  const name = localStorage.getItem(PLAYER_NAME_KEY);
  if (!name) return null;
  
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Save the player's name to localStorage
 * @param name The player's name
 * @throws Error if name is empty or whitespace-only
 */
export function setPlayerName(name: string): void {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Name cannot be empty');
  }
  localStorage.setItem(PLAYER_NAME_KEY, trimmed);
}

/**
 * Remove the player's name from localStorage
 */
export function clearPlayerName(): void {
  localStorage.removeItem(PLAYER_NAME_KEY);
}
