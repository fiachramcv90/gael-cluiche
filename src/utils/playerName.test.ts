import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPlayerName, setPlayerName, clearPlayerName, PLAYER_NAME_KEY } from '../utils/playerName';

describe('playerName utils', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReset();
    vi.mocked(localStorage.setItem).mockReset();
    vi.mocked(localStorage.removeItem).mockReset();
  });

  describe('getPlayerName', () => {
    it('returns null when no name is stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      
      expect(getPlayerName()).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith(PLAYER_NAME_KEY);
    });

    it('returns the stored name', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('Seán');
      
      expect(getPlayerName()).toBe('Seán');
    });

    it('returns null for empty string', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('');
      
      expect(getPlayerName()).toBeNull();
    });

    it('trims whitespace from stored name', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('  Aoife  ');
      
      expect(getPlayerName()).toBe('Aoife');
    });
  });

  describe('setPlayerName', () => {
    it('saves name to localStorage', () => {
      setPlayerName('Ciarán');
      
      expect(localStorage.setItem).toHaveBeenCalledWith(PLAYER_NAME_KEY, 'Ciarán');
    });

    it('trims whitespace before saving', () => {
      setPlayerName('  Niamh  ');
      
      expect(localStorage.setItem).toHaveBeenCalledWith(PLAYER_NAME_KEY, 'Niamh');
    });

    it('throws error for empty name', () => {
      expect(() => setPlayerName('')).toThrow('Name cannot be empty');
    });

    it('throws error for whitespace-only name', () => {
      expect(() => setPlayerName('   ')).toThrow('Name cannot be empty');
    });
  });

  describe('clearPlayerName', () => {
    it('removes name from localStorage', () => {
      clearPlayerName();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith(PLAYER_NAME_KEY);
    });
  });
});
