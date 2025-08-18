"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical, MessageCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  senderId: number | string
  senderName: string
  content: string
  subject?: string
  timestamp: string
  isOwn: boolean
  isRead?: boolean
}

export default function MessagesPage() {
  const router = useRouter()
  const { patient, isAuthenticated } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Get patient ID from auth context
  const patientId = patient?.id || 1; // Fallback to 1 if not authenticated

  const conversations = [
    {
      id: 1,
      name: "Dr. Spencer Barber",
      role: "Primary Healthcare Provider",
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-3545.up.railway.app'}/api/messages/patient/${patientId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }

        const result = await response.json()
        
        if (result.success) {
          // Format messages for display
          const formattedMessages = result.messages.map((msg: any) => ({
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
            conversations[0].unread = formattedMessages.filter((m: Message) => !m.isRead && !m.isOwn).length
          }

          // Mark messages as read when patient views them
          const markAsRead = async () => {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-3545.up.railway.app'}/api/messages/patient/${patientId}/mark-read`, {
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
      } catch (err: any) {
        console.error('Error fetching messages:', err)
        setError(err.message || 'An error occurred')
        // Fallback to sample messages if API fails
        setMessages([
    {
      id: 1,
      senderId: 1,
      senderName: "Dr. Spencer Barber",
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-3545.up.railway.app'}/api/messages/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId,
          content: newMessage,
          senderName: patient?.name || 'Patient', // Get from patient context
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
    <div className="min-h-screen bg-gradient-to-br from-btl-50 via-white to-btl-100">
      {/* Header with BTL gradient - Matching other sections */}
      <div className="bg-gradient-to-r from-btl-900 via-btl-700 to-btl-600 text-white px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl">
              <MessageCircle className="w-10 h-10 text-white opacity-90" />
            </div>
          <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-btl-100 mt-1">Communicate with your care team</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()} 
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

              <div className="flex h-[calc(100vh-140px)]">
        {/* Conversations List */}
        <div className="w-1/3 bg-white border-r border-charcoal-200">
          <div className="p-4 border-b border-charcoal-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-charcoal-200 rounded-xl focus:ring-2 focus:ring-btl-500 focus:border-btl-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 mx-3 my-2 border border-transparent cursor-pointer transition-all duration-200 rounded-xl ${
                  selectedConversation === conversation.id 
                    ? "bg-btl-50 border-btl-200 shadow-md" 
                    : "hover:bg-charcoal-50 hover:border-charcoal-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-btl-500 to-btl-600 flex items-center justify-center text-white font-semibold shadow-sm">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-charcoal-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-charcoal-500">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-btl-600 font-medium truncate">{conversation.role}</p>
                    <p className="text-sm text-charcoal-600 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="w-6 h-6 bg-btl-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-sm">
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
          <div className="bg-white border-b border-charcoal-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-btl-500 to-btl-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {selectedConv?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900">{selectedConv?.name}</h3>
                  <p className="text-sm text-btl-600 font-medium">{selectedConv?.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-btl-50 rounded-xl transition-all duration-200 border border-transparent hover:border-btl-200">
                  <Phone className="w-5 h-5 text-charcoal-600" />
                </button>
                <button className="p-2 hover:bg-btl-50 rounded-xl transition-all duration-200 border border-transparent hover:border-btl-200">
                  <Video className="w-5 h-5 text-charcoal-600" />
                </button>
                <button className="p-2 hover:bg-btl-50 rounded-xl transition-all duration-200 border border-transparent hover:border-btl-200">
                  <MoreVertical className="w-5 h-5 text-charcoal-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-btl-50/30 to-white">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-charcoal-500 flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-btl-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading messages...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
                  Error loading messages: {error}
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="bg-white border-2 border-dashed border-btl-200 rounded-2xl p-8 max-w-md mx-auto text-center shadow-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-btl-100 to-btl-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MessageCircle className="w-8 h-8 text-btl-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal-900 mb-2">No messages yet</h3>
                  <p className="text-charcoal-600 text-sm leading-relaxed">Your care team will send updates here</p>
                  <div className="mt-4 p-3 bg-btl-50 rounded-xl border border-btl-100">
                    <p className="text-xs text-btl-700 font-medium">Messages from Dr. Spencer Barber and your care team will appear here</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.isOwn 
                      ? "btn-primary-gradient text-white" 
                      : "bg-white border border-charcoal-200 text-charcoal-900"
                  }`}
                >
                    {message.subject && !message.isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-75">{message.subject}</p>
                    )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.isOwn ? "text-btl-100" : "text-charcoal-500"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-charcoal-200 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-3 border border-charcoal-200 rounded-xl focus:ring-2 focus:ring-btl-500 focus:border-btl-500 transition-all duration-200"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 btn-primary-gradient text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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
