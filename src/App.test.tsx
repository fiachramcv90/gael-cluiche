import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { PLAYER_NAME_KEY } from './utils/playerName';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    return ({ children, whileHover, whileTap, animate, initial, transition, ...props }: any) => {
      const Tag = tag as any;
      return <Tag {...props}>{children}</Tag>;
    };
  };
  
  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      h1: createMotionComponent('h1'),
      span: createMotionComponent('span'),
      form: createMotionComponent('form'),
      p: createMotionComponent('p'),
    },
    AnimatePresence: ({ children }: any) => children,
  };
});

describe('App - Onboarding Flow', () => {
  beforeEach(() => {
    vi.mocked(localStorage.getItem).mockReset();
    vi.mocked(localStorage.setItem).mockReset();
  });

  it('shows onboarding when no player name exists', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    render(<App />);

    // Should show onboarding
    await waitFor(() => {
      expect(screen.getByText(/Cad is ainm duit\?/i)).toBeInTheDocument();
    });
  });

  it('skips onboarding and shows StarMap when player name exists', async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === PLAYER_NAME_KEY) return 'Aoife';
      return null;
    });

    render(<App />);

    // Should show StarMap (has "Turas na Réalta" header)
    await waitFor(() => {
      expect(screen.getByText(/Turas na Réalta/i)).toBeInTheDocument();
    });

    // Should NOT show onboarding
    expect(screen.queryByText(/Cad is ainm duit\?/i)).not.toBeInTheDocument();
  });

  it('navigates to StarMap after completing onboarding', async () => {
    const user = userEvent.setup();
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    render(<App />);

    // Complete onboarding
    const input = await screen.findByRole('textbox');
    await user.type(input, 'Seán');
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    await user.click(button);

    // Should now show StarMap
    await waitFor(() => {
      expect(screen.getByText(/Turas na Réalta/i)).toBeInTheDocument();
    });
  });

  it('saves player name to localStorage after onboarding', async () => {
    const user = userEvent.setup();
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    render(<App />);

    // Complete onboarding
    const input = await screen.findByRole('textbox');
    await user.type(input, 'Ciarán');
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    await user.click(button);

    // Should have saved name
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(PLAYER_NAME_KEY, 'Ciarán');
    });
  });
});
