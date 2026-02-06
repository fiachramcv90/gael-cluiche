import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Onboarding } from './Onboarding';

describe('Onboarding', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockReset();
  });

  it('renders welcome message in Irish', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    expect(screen.getByText(/Dia duit!/i)).toBeInTheDocument();
    expect(screen.getByText(/Cad is ainm duit\?/i)).toBeInTheDocument();
  });

  it('renders dino character', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    expect(screen.getByTestId('dino-character')).toBeInTheDocument();
  });

  it('renders name input with placeholder', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'D\'ainm anseo...');
  });

  it('renders submit button', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    expect(screen.getByRole('button', { name: /Tosú/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    expect(button).toBeDisabled();
  });

  it('submit button is enabled when name is entered', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Aoife');
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    expect(button).not.toBeDisabled();
  });

  it('calls onComplete with name when form is submitted', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Seán');
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    await user.click(button);
    
    expect(mockOnComplete).toHaveBeenCalledWith('Seán');
  });

  it('trims whitespace from name before submitting', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '  Ciarán  ');
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    await user.click(button);
    
    expect(mockOnComplete).toHaveBeenCalledWith('Ciarán');
  });

  it('submits on Enter key press', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Niamh{Enter}');
    
    expect(mockOnComplete).toHaveBeenCalledWith('Niamh');
  });

  it('has accessible labels', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByLabelText(/ainm/i);
    expect(input).toBeInTheDocument();
  });

  it('input has large touch target', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const input = screen.getByRole('textbox');
    // Check it has the appropriate class for large touch target
    expect(input.className).toMatch(/text-xl|text-2xl|p-4|py-4|h-14|h-16/);
  });

  it('button has large touch target', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    const button = screen.getByRole('button', { name: /Tosú/i });
    // Check it has the appropriate class for large touch target
    expect(button.className).toMatch(/text-xl|text-2xl|p-4|py-4|h-14|h-16|min-h-/);
  });
});
