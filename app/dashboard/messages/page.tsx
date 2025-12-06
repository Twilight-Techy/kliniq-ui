"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { PatientSidebar } from "@/components/patient-sidebar"
import {
    MessageSquare,
    Send,
    Search,
    Bell,
    Menu,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Smile,
    ChevronLeft,
    Mic,
    MicOff,
    X,
    Minimize2,
    Maximize2,
    PhoneOff,
    Volume2,
} from "lucide-react"

interface Message {
    id: string
    sender: "user" | "clinician"
    senderName: string
    content: string
    timestamp: Date
    read: boolean
    isAudio?: boolean
    attachment?: {
        name: string
        size: number
        type: string
    }
}

interface Conversation {
    id: string
    clinicianName: string
    clinicianRole: string
    avatar: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    online: boolean
}

const mockConversations: Conversation[] = [
    {
        id: "1",
        clinicianName: "Dr. Oluwaseun Adeyemi",
        clinicianRole: "General Medicine",
        avatar: "OA",
        lastMessage: "Your test results look normal. Continue with the medication.",
        lastMessageTime: "2m ago",
        unreadCount: 2,
        online: true,
    },
    {
        id: "2",
        clinicianName: "Nurse Amaka",
        clinicianRole: "Triage Nurse",
        avatar: "NA",
        lastMessage: "I've forwarded your query to the doctor.",
        lastMessageTime: "1h ago",
        unreadCount: 0,
        online: true,
    },
    {
        id: "3",
        clinicianName: "Dr. Amara Obi",
        clinicianRole: "Cardiology",
        avatar: "AO",
        lastMessage: "Please schedule a follow-up next week.",
        lastMessageTime: "3h ago",
        unreadCount: 1,
        online: false,
    },
]

const mockMessages: Message[] = [
    {
        id: "1",
        sender: "clinician",
        senderName: "Dr. Oluwaseun Adeyemi",
        content: "Good morning! How are you feeling today?",
        timestamp: new Date(Date.now() - 3600000),
        read: true,
    },
    {
        id: "2",
        sender: "user",
        senderName: "You",
        content: "Better than yesterday. The headache has reduced.",
        timestamp: new Date(Date.now() - 3000000),
        read: true,
    },
    {
        id: "3",
        sender: "clinician",
        senderName: "Dr. Oluwaseun Adeyemi",
        content: "That's great to hear! Continue with the medication as prescribed. Are you taking it after meals?",
        timestamp: new Date(Date.now() - 2400000),
        read: true,
    },
    {
        id: "4",
        sender: "user",
        senderName: "You",
        content: "Yes, after breakfast and dinner as you instructed.",
        timestamp: new Date(Date.now() - 1800000),
        read: true,
    },
    {
        id: "5",
        sender: "clinician",
        senderName: "Dr. Oluwaseun Adeyemi",
        content: "Your test results look normal. Continue with the medication.",
        timestamp: new Date(Date.now() - 120000),
        read: false,
    },
]

export default function MessagesPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
    const [messageInput, setMessageInput] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [showMobileChat, setShowMobileChat] = useState(false)
    const [showVoiceCall, setShowVoiceCall] = useState(false)
    const [showVideoCall, setShowVideoCall] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [callMinimized, setCallMinimized] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showTranscript, setShowTranscript] = useState<string | null>(null)
    const [messages, setMessages] = useState(mockMessages)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const filteredConversations = mockConversations.filter((conv) =>
        conv.clinicianName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSendMessage = () => {
        if (!messageInput.trim() && !selectedFile) return

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            senderName: "You",
            content: messageInput || "📎 File attached",
            timestamp: new Date(),
            read: true,
            attachment: selectedFile ? {
                name: selectedFile.name,
                size: selectedFile.size,
                type: selectedFile.type,
            } : undefined,
        }

        setMessages([...messages, newMessage])
        setMessageInput("")
        setSelectedFile(null)
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex max-w-full overflow-x-hidden">
            <PatientSidebar activePath="/dashboard/messages" sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen max-w-full">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Messages</h1>
                                <p className="text-sm text-muted-foreground">Chat with your healthcare providers</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                            </button>
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex max-w-full overflow-hidden">
                    {/* Conversations List */}
                    <div className={cn(
                        "w-full md:w-80 lg:w-96 max-w-full md:border-r border-border/50 flex flex-col bg-card/50",
                        showMobileChat && "hidden md:flex"
                    )}>
                        <div className="p-4 border-b border-border/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-background/50 border-border/50 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.map((conv) => (
                                <motion.button
                                    key={conv.id}
                                    onClick={() => {
                                        setSelectedConversation(conv.id)
                                        setShowMobileChat(true)
                                    }}
                                    whileHover={{ x: 4 }}
                                    className={cn(
                                        "w-full max-w-full p-4 flex items-start gap-3 border-b border-border/50 transition-colors overflow-hidden",
                                        selectedConversation === conv.id
                                            ? "bg-primary/10 border-l-4 border-l-primary"
                                            : "hover:bg-secondary/30"
                                    )}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-semibold">
                                            {conv.avatar}
                                        </div>
                                        {conv.online && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left overflow-hidden">
                                        <div className="flex items-center justify-between mb-1 gap-2">
                                            <h3 className="font-semibold text-foreground truncate flex-1">{conv.clinicianName}</h3>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">{conv.lastMessageTime}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1 truncate">{conv.clinicianRole}</p>
                                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    {selectedConversation && (
                        <div className={cn(
                            "flex-1 flex flex-col overflow-hidden",
                            !showMobileChat && "hidden md:flex"
                        )}>
                            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                                            OA
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Dr. Oluwaseun Adeyemi</h3>
                                            <p className="text-xs text-green-500 flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowVoiceCall(true)}
                                            className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                        >
                                            <Phone className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => setShowVideoCall(true)}
                                            className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                        >
                                            <Video className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                        <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
                                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                                    >
                                        <div
                                            className={cn(
                                                "max-w-[70%] rounded-2xl",
                                                message.sender === "user"
                                                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-md"
                                                    : "bg-secondary/50 text-foreground rounded-bl-md"
                                            )}
                                        >
                                            <div className="p-4">
                                                <p className="text-sm leading-relaxed">{message.content}</p>

                                                {/* Voice Message Transcript Toggle */}
                                                {message.isAudio && (
                                                    <>
                                                        <button
                                                            onClick={() => setShowTranscript(showTranscript === message.id ? null : message.id)}
                                                            className="mt-2 text-xs underline opacity-70 hover:opacity-100 transition-opacity"
                                                        >
                                                            {showTranscript === message.id ? "Hide Transcript" : "Show Transcript"}
                                                        </button>
                                                        {showTranscript === message.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                className="mt-3 pt-3 border-t border-primary-foreground/20"
                                                            >
                                                                <p className="text-xs opacity-70 mb-1">Transcribed:</p>
                                                                <p className="text-sm">"I need to reschedule my appointment for next week"</p>
                                                            </motion.div>
                                                        )}
                                                    </>
                                                )}

                                                {/* File Attachment Display */}
                                                {message.attachment && (
                                                    <div className="mt-3 p-3 bg-black/10 rounded-xl flex items-center gap-2">
                                                        <Paperclip className="w-4 h-4" />
                                                        <div>
                                                            <p className="text-sm font-medium">{message.attachment.name}</p>
                                                            <p className="text-xs opacity-70">{(message.attachment.size / 1024).toFixed(2)} KB</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <p
                                                    className={cn(
                                                        "text-xs mt-2",
                                                        message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedFile(file)
                                        }
                                    }}
                                />

                                {/* Selected File Preview */}
                                {selectedFile && (
                                    <div className="mb-3 p-3 bg-secondary/30 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="p-1 rounded-lg hover:bg-secondary transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                    >
                                        <Paperclip className="w-5 h-5 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!isRecording) {
                                                setIsRecording(true)
                                            } else {
                                                // Stop recording and send voice message
                                                setIsRecording(false)

                                                const voiceMessage: Message = {
                                                    id: Date.now().toString(),
                                                    sender: "user",
                                                    senderName: "You",
                                                    content: "🎤 Voice message recorded",
                                                    timestamp: new Date(),
                                                    read: true,
                                                    isAudio: true,
                                                }

                                                setMessages([...messages, voiceMessage])
                                            }
                                        }}
                                        className={cn(
                                            "p-2 rounded-xl transition-all",
                                            isRecording ? "bg-destructive text-destructive-foreground animate-pulse" : "hover:bg-secondary"
                                        )}
                                    >
                                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                        >
                                            <Smile className="w-5 h-5 text-muted-foreground" />
                                        </button>

                                        {/* Emoji Picker */}
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 right-0 w-80 bg-card border border-border/50 rounded-2xl shadow-xl p-4 z-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-sm">Emojis</h4>
                                                    <button
                                                        onClick={() => setShowEmojiPicker(false)}
                                                        className="p-1 rounded-lg hover:bg-secondary"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                                                    {["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺️", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "💪", "👍", "👎", "👏", "🙌", "👋", "🤝", "❤️", "💙", "💚", "💛", "🧡", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "✨", "⭐", "🌟", "💫", "🔥", "💯", "✅", "❌", "🎉", "🎊", "🎈"].map((emoji) => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => {
                                                                setMessageInput(prev => prev + emoji)
                                                                setShowEmojiPicker(false)
                                                            }}
                                                            className="p-2 text-2xl hover:bg-secondary rounded-lg transition-colors"
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="h-12 bg-background/50 border-border/50 rounded-xl"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSendMessage}
                                        className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-0"
                                    >
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Voice Call UI */}
                {showVoiceCall && (
                    <div className={cn(
                        "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
                        callMinimized && "items-end justify-end"
                    )}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl",
                                callMinimized ? "w-80 h-24" : "w-full max-w-md h-[500px]"
                            )}
                        >
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-lg text-foreground">Voice Call</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCallMinimized(!callMinimized)}
                                            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                                        >
                                            {callMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowVoiceCall(false)
                                                setCallMinimized(false)
                                            }}
                                            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {!callMinimized && (
                                    <>
                                        <div className="flex-1 flex flex-col items-center justify-center">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4 animate-pulse">
                                                OA
                                            </div>
                                            <h4 className="font-semibold text-xl text-foreground mb-2">Dr. Oluwaseun Adeyemi</h4>
                                            <p className="text-sm text-muted-foreground mb-6">Calling...</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span>Connecting</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-6 mt-8">
                                            <button className="p-4 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                                                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowVoiceCall(false)
                                                    setCallMinimized(false)
                                                }}
                                                className="p-5 rounded-full bg-destructive hover:bg-destructive/90 transition-colors"
                                            >
                                                <PhoneOff className="w-7 h-7 text-white" />
                                            </button>
                                            <button className="p-4 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                                                <Volume2 className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Video Call UI */}
                {showVideoCall && (
                    <div className={cn(
                        "fixed inset-0 bg-black z-50",
                        callMinimized && "inset-auto bottom-4 right-4 w-80 h-60 rounded-3xl overflow-hidden"
                    )}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative w-full h-full"
                        >
                            {/* Remote Video (Simulated) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-4xl mb-4 animate-pulse">
                                        OA
                                    </div>
                                    <h4 className="font-semibold text-2xl text-white mb-2">Dr. Oluwaseun Adeyemi</h4>
                                    <p className="text-white/70">Connecting...</p>
                                </div>
                            </div>

                            {/* Local Video (Simulated) */}
                            {!callMinimized && (
                                <div className="absolute top-4 right-4 w-40 h-32 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 border-2 border-white/20 overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-white/50 text-sm">Your Video</span>
                                    </div>
                                </div>
                            )}

                            {/* Controls */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <div className="flex items-center justify-between max-w-md mx-auto">
                                    <button
                                        onClick={() => setCallMinimized(!callMinimized)}
                                        className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-white"
                                    >
                                        {callMinimized ? <Maximize2 className="w-6 h-6" /> : <Minimize2 className="w-6 h-6" />}
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-white">
                                            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowVideoCall(false)
                                                setCallMinimized(false)
                                            }}
                                            className="p-5 rounded-full bg-destructive hover:bg-destructive/90 transition-colors text-white"
                                        >
                                            <PhoneOff className="w-7 h-7" />
                                        </button>
                                        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-white">
                                            <Video className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setShowVideoCall(false)
                                            setCallMinimized(false)
                                        }}
                                        className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    )
}
