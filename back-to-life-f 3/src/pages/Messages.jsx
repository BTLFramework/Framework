import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://framework-production-92f5.up.railway.app/api/messages/conversations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const result = await response.json();
        
        if (result.success) {
          setConversations(result.conversations);
          // Auto-select first conversation if available
          if (result.conversations.length > 0 && !selectedConversation) {
            fetchConversationMessages(result.conversations[0].patientId);
          }
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected conversation
  const fetchConversationMessages = async (patientId) => {
    try {
      setMessagesLoading(true);
              const response = await fetch(`https://framework-production-92f5.up.railway.app/api/messages/conversation/${patientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const result = await response.json();
      
      if (result.success) {
        setMessages(result.messages.reverse()); // Reverse to show oldest first
        setSelectedConversation(result.patient);
        
        // Update the conversation in the list to mark as read
        setConversations(prev => 
          prev.map(conv => 
            conv.patientId === patientId 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (err) {
      console.error('Error fetching conversation messages:', err);
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send reply message (no subject required)
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('https://framework-production-92f5.up.railway.app/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedConversation.id,
          subject: 'Reply from clinician', // Default subject for replies
          content: newMessage,
          senderName: 'Clinician', // TODO: Get from authenticated user context
          senderEmail: 'dr.mitchell@clinic.com'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Add the new message to the conversation
        const newMsg = {
          id: result.data.id,
          subject: 'Reply from clinician',
          content: newMessage,
          senderType: 'CLINICIAN',
          senderName: 'Dr. Sarah Mitchell',
          createdAt: result.data.sentAt
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update conversation list
        setConversations(prev => 
          prev.map(conv => 
            conv.patientId === selectedConversation.id 
              ? { 
                  ...conv, 
                  lastMessage: {
                    content: newMessage,
                    subject: 'Reply from clinician',
                    timestamp: result.data.sentAt,
                    senderType: 'CLINICIAN',
                    senderName: 'Dr. Sarah Mitchell'
                  }
                }
              : conv
          )
        );
        
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Send new message with subject
  const handleSendNewMessage = async () => {
    if (!newMessage.trim() || !messageSubject.trim() || !selectedConversation) return;

    try {
      const response = await fetch('https://framework-production-92f5.up.railway.app/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedConversation.id,
          subject: messageSubject,
          content: newMessage,
          senderName: 'Dr. Sarah Mitchell',
          senderEmail: 'dr.mitchell@clinic.com'
        })
      });

      const result = await response.json();

      if (result.success) {
        const newMsg = {
          id: result.data.id,
          subject: messageSubject,
          content: newMessage,
          senderType: 'CLINICIAN',
          senderName: 'Dr. Sarah Mitchell',
          createdAt: result.data.sentAt
        };
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        setMessageSubject('');
        setShowNewMessageModal(false);
        
        setConversations(prev => 
          prev.map(conv => 
            conv.patientId === selectedConversation.id 
              ? { 
                  ...conv, 
                  lastMessage: {
                    content: newMessage,
                    subject: messageSubject,
                    timestamp: result.data.sentAt,
                    senderType: 'CLINICIAN',
                    senderName: 'Dr. Sarah Mitchell'
                  }
                }
              : conv
          )
        );
        
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <DashboardHeader onLogout={handleLogout} onRefresh={handleRefresh} lastUpdated={lastUpdated} />
      
      <div style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Messages</h1>
              <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>Communicate with your patients</p>
            </div>
            <button
              onClick={() => setShowNewMessageModal(true)}
              disabled={!selectedConversation}
              style={{
                padding: '12px 24px',
                background: selectedConversation 
                  ? 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)' 
                  : '#d1d5db',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: selectedConversation ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Message
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
          {/* Conversations List */}
          <div style={{ 
            width: '400px', 
            backgroundColor: 'white', 
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '20px', 
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ position: 'relative' }}>
                <svg 
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9ca3af', 
                    width: '16px', 
                    height: '16px' 
                  }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  style={{
                    width: '100%',
                    paddingLeft: '40px',
                    paddingRight: '16px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  Loading conversations...
                </div>
              ) : error ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
                  Error: {error}
                </div>
              ) : conversations.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No conversations yet
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.patientId}
                    onClick={() => fetchConversationMessages(conversation.patientId)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      backgroundColor: selectedConversation?.id === conversation.patientId ? '#eff6ff' : 'transparent'
                    }}
                    onMouseOver={(e) => {
                      if (selectedConversation?.id !== conversation.patientId) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedConversation?.id !== conversation.patientId) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {conversation.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }}></div>
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {conversation.patientName}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {conversation.unreadCount > 0 && (
                              <div style={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                minWidth: '18px',
                                textAlign: 'center'
                              }}>
                                {conversation.unreadCount}
                              </div>
                            )}
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              {conversation.lastMessage ? formatTimestamp(conversation.lastMessage.timestamp) : 'No messages'}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 2px 0' }}>
                          {conversation.patientEmail}
                        </p>
                        {conversation.lastMessage && (
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280', 
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            <strong>{conversation.lastMessage.senderType === 'PATIENT' ? conversation.patientName : 'You'}:</strong> {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ 
            flex: 1, 
            backgroundColor: 'white', 
            display: 'flex',
            flexDirection: 'column'
          }}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div style={{ 
                  padding: '20px', 
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {selectedConversation.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                        {selectedConversation.email} • Intake: {new Date(selectedConversation.intakeDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: '20px', overflow: 'auto', maxHeight: 'calc(100vh - 400px)' }}>
                  {messagesLoading ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                      No messages in this conversation yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          style={{
                            display: 'flex',
                            justifyContent: message.senderType === 'CLINICIAN' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              padding: '12px 16px',
                              borderRadius: '18px',
                              backgroundColor: message.senderType === 'CLINICIAN' ? '#0891b2' : '#f3f4f6',
                              color: message.senderType === 'CLINICIAN' ? 'white' : '#1f2937'
                            }}
                          >
                            {message.subject && message.subject !== 'Reply from clinician' && (
                              <div style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: '600', 
                                marginBottom: '4px',
                                opacity: 0.9
                              }}>
                                {message.subject}
                              </div>
                            )}
                            <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: '1.4' }}>
                              {message.content}
                            </p>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              marginTop: '4px', 
                              opacity: 0.7,
                              textAlign: 'right'
                            }}>
                              {formatMessageTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div style={{ 
                  padding: '20px', 
                  borderTop: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={1}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        resize: 'none',
                        minHeight: '44px',
                        maxHeight: '120px',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      style={{
                        width: '44px',
                        height: '44px',
                        backgroundColor: newMessage.trim() ? '#0891b2' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (newMessage.trim()) {
                          e.target.style.backgroundColor = '#0e7490';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (newMessage.trim()) {
                          e.target.style.backgroundColor = '#0891b2';
                        }
                      }}
                    >
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                color: '#6b7280',
                textAlign: 'center'
              }}>
                <div>
                  <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#d1d5db' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>Select a conversation</p>
                  <p style={{ fontSize: '0.875rem', margin: '8px 0 0 0' }}>Choose a patient to view your message history</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
              New Message to {selectedConversation?.name}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Message subject..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '100px',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setNewMessage('');
                  setMessageSubject('');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendNewMessage}
                disabled={!newMessage.trim() || !messageSubject.trim()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (!newMessage.trim() || !messageSubject.trim()) ? '#d1d5db' : '#0891b2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: (!newMessage.trim() || !messageSubject.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 