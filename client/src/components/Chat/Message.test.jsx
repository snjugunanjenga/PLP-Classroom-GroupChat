import { render, screen } from '@testing-library/react';
import Message from './Message';
import { AuthContext } from '../../context/AuthContext';

describe('Message', () => {
  it('renders message content, sender, and timestamp', () => {
    const message = {
      sender: { username: 'alice' },
      content: 'Hello world',
      timestamp: new Date().toISOString(),
    };
    render(
      <AuthContext.Provider value={{ user: { username: 'bob' } }}>
        <Message message={message} />
      </AuthContext.Provider>
    );
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    // Timestamp is present (format: HH:MM)
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it('applies sent style if user is sender', () => {
    const message = {
      sender: { username: 'bob' },
      content: 'Hi!',
      timestamp: new Date().toISOString(),
    };
    const { container } = render(
      <AuthContext.Provider value={{ user: { username: 'bob' } }}>
        <Message message={message} />
      </AuthContext.Provider>
    );
    // Sent messages have bg-green-700
    expect(container.querySelector('.bg-green-700')).toBeInTheDocument();
  });

  it('applies received style if user is not sender', () => {
    const message = {
      sender: { username: 'alice' },
      content: 'Hi!',
      timestamp: new Date().toISOString(),
    };
    const { container } = render(
      <AuthContext.Provider value={{ user: { username: 'bob' } }}>
        <Message message={message} />
      </AuthContext.Provider>
    );
    // Received messages have bg-gray-800
    expect(container.querySelector('.bg-gray-800')).toBeInTheDocument();
  });
}); 