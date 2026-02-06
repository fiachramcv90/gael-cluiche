import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChangeNameModal } from './ChangeNameModal';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return ({ children, whileHover, whileTap, animate, initial, exit, transition, ...domProps }: Record<string, unknown>) => {
      const Tag = tag as keyof JSX.IntrinsicElements;
      return <Tag {...domProps}>{children as React.ReactNode}</Tag>;
    };
  };
  
  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      form: createMotionComponent('form'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('ChangeNameModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnSave.mockReset();
    mockOnClose.mockReset();
  });

  it('renders with current name in input', () => {
    render(
      <ChangeNameModal 
        isOpen={true} 
        currentName="Aoife" 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Aoife');
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ChangeNameModal 
        isOpen={false} 
        currentName="Aoife" 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );
    
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title in Irish', () => {
    render(
      <ChangeNameModal 
        isOpen={true} 
        currentName="Aoife" 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByText(/Athraigh d'ainm/i)).toBeInTheDocument();
  });

  it('calls onSave with new name when submitted', async () => {
    const user = userEvent.setup();
    render(
      <ChangeNameModal 
        isOpen={true} 
        currentName="Aoife" 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Seán');
    
    const saveButton = screen.getByRole('button', { name: /Sábháil/i });
    await user.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith('Seán');
  });

  it('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ChangeNameModal 
        isOpen={true} 
        currentName="Aoife" 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /Cealaigh/i });
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('save button is disabled when input is empty', async () => {
    const user = userEvent.setup();
    render(
      <ChangeNameModal 
        isOpen={true} 
        currentName="Aoife" 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    const saveButton = screen.getByRole('button', { name: /Sábháil/i });
    expect(saveButton).toBeDisabled();
  });
});
