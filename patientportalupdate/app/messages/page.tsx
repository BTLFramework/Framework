"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MessagesPage() {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // This should be dynamic - get from patient context/auth
  const patientId = 1; // TODO: Get from authentication context

  const conversations = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      role: "Physical Therapist",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Loading...",
      timestamp: "Loading...",
      unread: 0,
      online: true,
    },
  ]

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:3001/api/messages/patient/${patientId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }

        const result = await response.json()
        
        if (result.success) {
          // Format messages for display
          const formattedMessages = result.messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderType === 'CLINICIAN' ? 1 : 'me',
            senderName: msg.senderName,
            content: msg.content,
            subject: msg.subject,
            timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }),
            isOwn: msg.senderType === 'PATIENT',
            isRead: msg.isRead
          }))
          
          setMessages(formattedMessages)
          
          // Update conversation with latest message
          if (formattedMessages.length > 0) {
            const latestMessage = formattedMessages[0]
            conversations[0].lastMessage = latestMessage.content
            conversations[0].timestamp = latestMessage.timestamp
            conversations[0].unread = formattedMessages.filter(m => !m.isRead && !m.isOwn).length
          }

          // Mark messages as read when patient views them
          const markAsRead = async () => {
            try {
              await fetch(`http://localhost:3001/api/messages/patient/${patientId}/mark-read`, {
                method: 'PATCH'
              })
            } catch (error) {
              console.error('Error marking messages as read:', error)
            }
          }

          // Mark as read after a short delay (so user can see the messages first)
          setTimeout(markAsRead, 2000)
        } else {
          throw new Error(result.error || 'Failed to fetch messages')
        }
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError(err.message)
        // Fallback to sample messages if API fails
        setMessages([
    {
      id: 1,
      senderId: 1,
      senderName: "Dr. Sarah Mitchell",
            content: "Welcome to your patient portal! I'll be sending you updates and check-ins here.",
      timestamp: "2:30 PM",
      isOwn: false,
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [patientId])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch('http://localhost:3001/api/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId,
          content: newMessage,
          senderName: 'Sarah Johnson', // TODO: Get from patient context
          subject: 'Reply from patient'
        })
      })

      const result = await response.json()

      if (result.success) {
        // Add the new message to the list
        const newMsg = {
          id: result.data.id,
          senderId: 'me',
          senderName: 'You',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
      isOwn: true,
        }
        
        setMessages(prev => [newMsg, ...prev])
      setNewMessage("")
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Communicate with your care team</p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Conversations List */}
        <div className="w-1/3 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation === conversation.id ? "bg-teal-50 border-teal-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.role}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="w-5 h-5 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedConv?.avatar || "/placeholder.svg"}
                  alt={selectedConv?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConv?.name}</h3>
                  <p className="text-sm text-gray-600">{selectedConv?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-red-500">Error loading messages: {error}</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">No messages yet. Your care team will send updates here.</div>
              </div>
            ) : (
              messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                    {message.subject && !message.isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-75">{message.subject}</p>
                    )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? "text-teal-100" : "text-gray-500"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
