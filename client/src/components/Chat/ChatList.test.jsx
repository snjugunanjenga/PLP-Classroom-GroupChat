import { render, screen, fireEvent } from '@testing-library/react';
import ChatList from './ChatList';
import { AuthContext } from '../../context/AuthContext';

const mockChats = [
  { _id: '1', name: 'Group 1', members: [], admin: 'user1' },
  { _id: '2', name: 'Group 2', members: [], admin: 'user2' },
];
const mockUsers = [
  { _id: 'user1', username: 'alice' },
  { _id: 'user2', username: 'bob' },
];

describe('ChatList', () => {
  it('renders group chats and private chats', () => {
    render(
      <AuthContext.Provider value={{ user: { username: 'alice', id: 'user1' } }}>
        <ChatList
          chats={mockChats}
          onSelectChat={() => {}}
          refetchChats={() => {}}
          onSelectPrivate={() => {}}
        />
      </AuthContext.Provider>
    );
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
    expect(screen.getByText('Private Chats')).toBeInTheDocument();
  });

  it('calls onSelectChat when a group is clicked', () => {
    const onSelectChat = jest.fn();
    render(
      <AuthContext.Provider value={{ user: { username: 'alice', id: 'user1' } }}>
        <ChatList
          chats={mockChats}
          onSelectChat={onSelectChat}
          refetchChats={() => {}}
          onSelectPrivate={() => {}}
        />
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByText('Group 1'));
    expect(onSelectChat).toHaveBeenCalled();
  });
}); 