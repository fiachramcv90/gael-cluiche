import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsButton } from './SettingsButton';

describe('SettingsButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockReset();
  });

  it('renders settings button', () => {
    render(<SettingsButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: /socruithe|settings/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsButton onClick={mockOnClick} />);
    
    const button = screen.getByRole('button', { name: /socruithe|settings/i });
    await user.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders gear icon', () => {
    render(<SettingsButton onClick={mockOnClick} />);
    
    // Check for gear emoji or icon
    expect(screen.getByText(/⚙️/)).toBeInTheDocument();
  });
});
