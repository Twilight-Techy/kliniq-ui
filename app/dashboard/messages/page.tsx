"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { cn } from "@/lib/utils"
import { PatientSidebar } from "@/components/patient-sidebar"
import { useToast } from "@/hooks/use-toast"
import { messagesApi, ConversationResponse, MessageResponse, AvailableClinician } from "@/lib/messages-api"
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
    Loader2,
    Plus,
    Users,
    Building2,
} from "lucide-react"

interface LocalMessage {
    id: string
    sender: "user" | "clinician"
    senderName: string
    content: string
    timestamp: Date
    read: boolean
    isAudio?: boolean
    attachment?: {
        name: string
        url?: string
    }
}

// Transform API message to local format
function transformMessage(msg: MessageResponse): LocalMessage {
    return {
        id: msg.id,
        sender: msg.is_mine ? "user" : "clinician",
        senderName: msg.sender_name,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        read: msg.is_read,
        isAudio: msg.message_type === "audio",
        attachment: msg.attachment_name ? {
            name: msg.attachment_name,
            url: msg.attachment_url
        } : undefined
    }
}

export default function MessagesPage() {
    const [mounted, setMounted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [conversations, setConversations] = useState<ConversationResponse[]>([])
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
    const [selectedConversationData, setSelectedConversationData] = useState<ConversationResponse | null>(null)
    const [messages, setMessages] = useState<LocalMessage[]>([])
    const [messageInput, setMessageInput] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [showMobileChat, setShowMobileChat] = useState(false)
    const [showVoiceCall, setShowVoiceCall] = useState(false)
    const [showVideoCall, setShowVideoCall] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [callMinimized, setCallMinimized] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showTranscript, setShowTranscript] = useState<string | null>(null)
    const [showNewConversation, setShowNewConversation] = useState(false)
    const [availableClinicians, setAvailableClinicians] = useState<AvailableClinician[]>([])
    const [loadingClinicians, setLoadingClinicians] = useState(false)
    const [clinicianSearchQuery, setClinicianSearchQuery] = useState("")
    const [startingConversationWith, setStartingConversationWith] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { toast } = useToast()

    // Fetch conversations on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await messagesApi.getConversations()
                setConversations(response.conversations)
                // Don't auto-select - let user choose
            } catch (error) {
                console.error("Failed to load conversations:", error)
            } finally {
                setLoading(false)
            }
        }

        setMounted(true)
        fetchConversations()
    }, [])

    // Fetch messages when conversation is selected
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation) return

            try {
                const response = await messagesApi.getConversation(selectedConversation)
                setSelectedConversationData(response.conversation)
                setMessages(response.messages.map(transformMessage))

                // Mark as read
                await messagesApi.markAsRead(selectedConversation)

                // Update unread count in conversations list
                setConversations(prev => prev.map(c =>
                    c.id === selectedConversation ? { ...c, unread_count: 0 } : c
                ))
            } catch (error) {
                console.error("Failed to load messages:", error)
            }
        }

        fetchMessages()
    }, [selectedConversation])

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const filteredConversations = conversations.filter((conv) =>
        conv.clinician_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation || sending) return

        setSending(true)
        const content = messageInput
        setMessageInput("")

        // Optimistic update
        const optimisticMessage: LocalMessage = {
            id: `temp-${Date.now()}`,
            sender: "user",
            senderName: "You",
            content: content,
            timestamp: new Date(),
            read: true,
        }
        setMessages(prev => [...prev, optimisticMessage])

        try {
            const response = await messagesApi.sendMessage(selectedConversation, {
                content: content,
                message_type: "text"
            })

            if (response.success && response.sent_message) {
                // Replace optimistic message with real one
                setMessages(prev => prev.map(m =>
                    m.id === optimisticMessage.id ? transformMessage(response.sent_message!) : m
                ))

                // Update last message in conversations list
                setConversations(prev => prev.map(c =>
                    c.id === selectedConversation
                        ? { ...c, last_message: content, last_message_time: "Just now" }
                        : c
                ))
            } else {
                // Remove optimistic message on failure
                setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
                toast({ title: "Error", description: "Failed to send message", variant: "destructive" })
            }
        } catch (error) {
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
            toast({ title: "Error", description: "Failed to send message", variant: "destructive" })
        } finally {
            setSending(false)
        }
    }

    const handleVoiceMessage = async () => {
        if (!selectedConversation) return

        if (!isRecording) {
            setIsRecording(true)
        } else {
            setIsRecording(false)

            // Send voice message
            setSending(true)
            try {
                const response = await messagesApi.sendMessage(selectedConversation, {
                    content: "🎤 Voice message",
                    message_type: "audio"
                })

                if (response.success && response.sent_message) {
                    setMessages(prev => [...prev, transformMessage(response.sent_message!)])
                }
            } catch (error) {
                toast({ title: "Error", description: "Failed to send voice message", variant: "destructive" })
            } finally {
                setSending(false)
            }
        }
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
                            <NotificationsDropdown />
                            <div className="hidden md:block">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="flex-1 flex max-w-full overflow-hidden">
                        {/* Conversations List */}
                        <div className={cn(
                            "w-full md:w-80 lg:w-96 max-w-full md:border-r border-border/50 flex flex-col bg-card/50",
                            showMobileChat && "hidden md:flex"
                        )}>
                            <div className="p-4 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search conversations..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 bg-background/50 border-border/50 rounded-xl"
                                        />
                                    </div>
                                    <Button
                                        onClick={async () => {
                                            setShowNewConversation(true)
                                            setLoadingClinicians(true)
                                            try {
                                                const response = await messagesApi.getAvailableClinicians()
                                                setAvailableClinicians(response.clinicians)
                                            } catch (error) {
                                                toast({ title: "Error", description: "Failed to load clinicians", variant: "destructive" })
                                            } finally {
                                                setLoadingClinicians(false)
                                            }
                                        }}
                                        size="icon"
                                        className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex-shrink-0"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                        <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                                        <p>No conversations yet</p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conv) => (
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
                                                    {conv.clinician_avatar}
                                                </div>
                                                {conv.is_online && (
                                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left overflow-hidden">
                                                <div className="flex items-center justify-between mb-1 gap-2">
                                                    <h3 className="font-semibold text-foreground truncate flex-1">{conv.clinician_name}</h3>
                                                    <span className="text-xs text-muted-foreground flex-shrink-0">{conv.last_message_time}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-1 truncate">{conv.clinician_role}</p>
                                                <p className="text-sm text-muted-foreground truncate">{conv.last_message || "No messages yet"}</p>
                                            </div>
                                            {conv.unread_count > 0 && (
                                                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                                                    {conv.unread_count}
                                                </div>
                                            )}
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        {selectedConversation && selectedConversationData ? (
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
                                                {selectedConversationData.clinician_avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{selectedConversationData.clinician_name}</h3>
                                                <p className={cn(
                                                    "text-xs flex items-center gap-1",
                                                    selectedConversationData.is_online ? "text-green-500" : "text-muted-foreground"
                                                )}>
                                                    {selectedConversationData.is_online && (
                                                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                                                    )}
                                                    {selectedConversationData.is_online ? "Online" : selectedConversationData.clinician_role}
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
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                                            <p>No messages yet</p>
                                            <p className="text-sm">Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
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
                                                                        <p className="text-sm">"Voice message transcription coming soon"</p>
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
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
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
                                            onClick={handleVoiceMessage}
                                            className={cn(
                                                "p-2 rounded-xl transition-all",
                                                isRecording ? "bg-destructive text-destructive-foreground animate-pulse" : "hover:bg-secondary"
                                            )}
                                        >
                                            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-muted-foreground" />}
                                        </button>
                                        <button
                                            className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                            title="Use your system emoji picker"
                                        >
                                            <Smile className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                        <div className="flex-1">
                                            <Input
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                                placeholder="Type a message..."
                                                className="h-12 bg-background/50 border-border/50 rounded-xl"
                                                disabled={sending}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim() || sending}
                                            className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-0"
                                        >
                                            {sending ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex flex-1 items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Voice Call UI */}
                {showVoiceCall && selectedConversationData && (
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
                                                {selectedConversationData.clinician_avatar}
                                            </div>
                                            <h4 className="font-semibold text-xl text-foreground mb-2">{selectedConversationData.clinician_name}</h4>
                                            <p className="text-sm text-muted-foreground mb-6">Calling...</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span>Connecting</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-6 mt-8">
                                            <button className="p-4 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                                                <Mic className="w-6 h-6" />
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
                {showVideoCall && selectedConversationData && (
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
                                        {selectedConversationData.clinician_avatar}
                                    </div>
                                    <h4 className="font-semibold text-2xl text-white mb-2">{selectedConversationData.clinician_name}</h4>
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
                                            <Mic className="w-6 h-6" />
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

                {/* New Conversation Modal */}
                {showNewConversation && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
                                <div>
                                    <h3 className="font-semibold text-lg text-foreground">New Conversation</h3>
                                    <p className="text-sm text-muted-foreground">Select a clinician to message</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowNewConversation(false)
                                        setClinicianSearchQuery("")
                                    }}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 border-b border-border/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search clinicians..."
                                        value={clinicianSearchQuery}
                                        onChange={(e) => setClinicianSearchQuery(e.target.value)}
                                        className="pl-10 bg-background/50 border-border/50 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {loadingClinicians ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : availableClinicians.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Users className="w-12 h-12 mb-3 opacity-30" />
                                        <p className="font-medium">No clinicians available</p>
                                        <p className="text-sm text-center px-6 mt-1">
                                            Link to a hospital to see available clinicians
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Group clinicians by hospital */}
                                        {Object.entries(
                                            availableClinicians
                                                .filter(c =>
                                                    c.name.toLowerCase().includes(clinicianSearchQuery.toLowerCase()) ||
                                                    c.specialty?.toLowerCase().includes(clinicianSearchQuery.toLowerCase()) ||
                                                    c.hospital_name.toLowerCase().includes(clinicianSearchQuery.toLowerCase())
                                                )
                                                .reduce((acc, c) => {
                                                    if (!acc[c.hospital_name]) acc[c.hospital_name] = []
                                                    acc[c.hospital_name].push(c)
                                                    return acc
                                                }, {} as Record<string, typeof availableClinicians>)
                                        ).map(([hospitalName, clinicians]) => (
                                            <div key={hospitalName}>
                                                <div className="px-4 py-2 bg-secondary/30 flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Building2 className="w-4 h-4" />
                                                    {hospitalName}
                                                </div>
                                                {clinicians.map((clinician) => (
                                                    <button
                                                        key={clinician.clinician_id}
                                                        onClick={async () => {
                                                            setStartingConversationWith(clinician.clinician_id)
                                                            try {
                                                                const response = await messagesApi.startConversation({
                                                                    clinician_id: clinician.user_id
                                                                })
                                                                if (response.success && response.conversation) {
                                                                    // Add to conversations list if new
                                                                    setConversations(prev => {
                                                                        const exists = prev.find(c => c.id === response.conversation!.id)
                                                                        if (exists) return prev
                                                                        return [response.conversation!, ...prev]
                                                                    })
                                                                    // Select the conversation
                                                                    setSelectedConversation(response.conversation.id)
                                                                    setShowNewConversation(false)
                                                                    setShowMobileChat(true)
                                                                    setClinicianSearchQuery("")
                                                                    toast({ title: "Success", description: "Conversation started" })
                                                                }
                                                            } catch (error) {
                                                                toast({ title: "Error", description: "Failed to start conversation", variant: "destructive" })
                                                            } finally {
                                                                setStartingConversationWith(null)
                                                            }
                                                        }}
                                                        disabled={startingConversationWith !== null}
                                                        className="w-full p-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors text-left border-b border-border/20 last:border-b-0"
                                                    >
                                                        <div className="relative">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-semibold">
                                                                {clinician.avatar}
                                                            </div>
                                                            {clinician.is_online && (
                                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-foreground truncate">{clinician.name}</h4>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {clinician.specialty || clinician.role}
                                                            </p>
                                                        </div>
                                                        {startingConversationWith === clinician.clinician_id && (
                                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    )
}
