"use client"

import { useState } from "react"
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MessagesPage() {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      role: "Physical Therapist",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "How are you feeling after yesterday's session?",
      timestamp: "2 hours ago",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Recovery Support Team",
      role: "Support Team",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Your weekly progress report is ready",
      timestamp: "1 day ago",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      role: "Physician",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Let's schedule your follow-up appointment",
      timestamp: "3 days ago",
      unread: 1,
      online: false,
    },
  ]

  const messages = [
    {
      id: 1,
      senderId: 1,
      senderName: "Dr. Sarah Mitchell",
      content: "Hi Sarah! How are you feeling after yesterday's session?",
      timestamp: "2:30 PM",
      isOwn: false,
    },
    {
      id: 2,
      senderId: "me",
      senderName: "You",
      content: "Much better! The exercises you showed me really helped with the stiffness.",
      timestamp: "2:45 PM",
      isOwn: true,
    },
    {
      id: 3,
      senderId: 1,
      senderName: "Dr. Sarah Mitchell",
      content:
        "That's wonderful to hear! Keep up with the morning routine we discussed. How's your pain level today on a scale of 1-10?",
      timestamp: "2:47 PM",
      isOwn: false,
    },
    {
      id: 4,
      senderId: "me",
      senderName: "You",
      content: "I'd say it's about a 3-4 today, which is much better than last week when it was around 7.",
      timestamp: "3:15 PM",
      isOwn: true,
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Dr. Sarah Mitchell",
      content:
        "Excellent progress! I'll update your recovery score. Don't forget to complete your weekly assessment by Friday.",
      timestamp: "3:20 PM",
      isOwn: false,
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
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
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isOwn ? "text-teal-100" : "text-gray-500"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
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
