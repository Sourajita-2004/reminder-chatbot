"use client"

import { useChat } from "ai/react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { RoutineDisplay } from "@/components/routine-display"
import { ReminderSettings } from "@/components/reminder-settings"
import { ProfessionSelector } from "@/components/profession-selector"

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content:
          "👋 Hi there! I'm your Daily Routine Assistant. I can help you plan your day based on your profession and tasks. Let's start by telling me your profession, or you can add tasks for tomorrow.",
      },
    ],
  })

  const [profession, setProfession] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; time?: string; completed: boolean }>>([])
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle profession selection
  const handleProfessionSelect = async (selectedProfession: string) => {
    setProfession(selectedProfession)
    await append({
      role: "user",
      content: `My profession is ${selectedProfession}`,
    })
  }

  // Add a quick action
  const handleQuickAction = async (action: string) => {
    await append({
      role: "user",
      content: action,
    })
  }

  // Extract tasks from assistant messages
  useEffect(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant")
    if (assistantMessages.length > 0) {
      const lastMessage = assistantMessages[assistantMessages.length - 1].content

      // Very simple task extraction - in a real app, you'd want more sophisticated parsing
      if (lastMessage.includes("TASKS:")) {
        const taskSection = lastMessage.split("TASKS:")[1].split("\n\n")[0]
        const taskLines = taskSection.split("\n").filter((line) => line.trim().length > 0)

        const extractedTasks = taskLines.map((line) => {
          const timeMatch = line.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/)
          const time = timeMatch ? timeMatch[0] : undefined
          const title = line
            .replace(timeMatch ? timeMatch[0] : "", "")
            .replace(/^[-•*\s]+/, "")
            .trim()

          return {
            id: Math.random().toString(36).substring(2),
            title,
            time,
            completed: false,
          }
        })

        if (extractedTasks.length > 0) {
          setTasks((prev) => [...prev, ...extractedTasks])
        }
      }

      // Extract profession if not set
      if (!profession && lastMessage.includes("profession")) {
        const professionMatch = lastMessage.match(/for a (.*?) would/)
        if (professionMatch && professionMatch[1]) {
          setProfession(professionMatch[1].trim())
        }
      }
    }
  }, [messages, profession])

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="routine">Routine</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex flex-col h-full">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-4",
                    message.role === "user" ? "bg-muted ml-auto max-w-[80%]" : "bg-primary/10 mr-auto max-w-[80%]",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-semibold">
                        AI
                      </div>
                    )}
                  </Avatar>
                  <div className="text-sm">
                    {message.content.split("\n").map((line, i) => (
                      <p key={i} className={line.startsWith("TASKS:") ? "font-semibold" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {!profession && (
            <Card className="p-4 mb-4">
              <h3 className="font-medium mb-2">Select your profession to get started:</h3>
              <ProfessionSelector onSelect={handleProfessionSelect} />
            </Card>
          )}

          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("What should I do now?")}
              className="text-xs"
            >
              What should I do now?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("I have 1 hour free, suggest a task.")}
              className="text-xs"
            >
              I have 1 hour free
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Generate a daily routine for me.")}
              className="text-xs"
            >
              Generate routine
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("Set reminders for my tasks.")}
              className="text-xs"
            >
              Set reminders
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input value={input} onChange={handleInputChange} placeholder="Type your message..." className="flex-1" />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="routine" className="h-full">
          <RoutineDisplay profession={profession} tasks={tasks} />
        </TabsContent>

        <TabsContent value="reminders" className="h-full">
          <ReminderSettings tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
