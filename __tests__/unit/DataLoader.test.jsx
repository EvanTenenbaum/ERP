import { render, screen } from '@testing-library/react';
import DataLoader from '@/components/DataLoader';
import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the router
jest.mock('next/router', () => ({
  useRouter: () => ({
    reload: jest.fn(),
  }),
}));

describe('DataLoader Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders the seed database button', () => {
    render(<DataLoader />);
    
    const button = screen.getByRole('button', { name: /seed database/i });
    expect(button).toBeInTheDocument();
  });

  it('disables the button and shows loading state when seeding', async () => {
    // Mock a pending fetch request
    global.fetch.mockImplementationOnce(() => new Promise(() => {}));
    
    const { rerender } = render(<DataLoader />);
    
    // Click the button to start seeding
    const button = screen.getByRole('button', { name: /seed database/i });
    button.click();
    
    // Force a re-render to see the loading state
    rerender(<DataLoader />);
    
    // Check that the button is disabled and shows loading text
    const loadingButton = screen.getByRole('button', { name: /seeding database/i });
    expect(loadingButton).toBeDisabled();
  });

  it('shows success message when seeding is successful', async () => {
    // Mock a successful fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<DataLoader />);
    
    // Click the button to start seeding
    const button = screen.getByRole('button', { name: /seed database/i });
    button.click();
    
    // Wait for the fetch to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check that the success alert was shown
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Database seeded successfully'));
    
    // Restore the original alert function
    alertMock.mockRestore();
  });

  it('shows error message when seeding fails', async () => {
    // Mock a failed fetch response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ 
        error: { message: 'Test error message' } 
      }),
    });
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<DataLoader />);
    
    // Click the button to start seeding
    const button = screen.getByRole('button', { name: /seed database/i });
    button.click();
    
    // Wait for the fetch to resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check that the error alert was shown
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Error seeding database'));
    
    // Restore the original alert function
    alertMock.mockRestore();
  });
});
