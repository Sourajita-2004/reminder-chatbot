"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Download, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Task {
  id: string
  title: string
  time?: string
  completed: boolean
}

interface RoutineDisplayProps {
  profession: string | null
  tasks: Task[]
}

// Sample routine templates for different professions
const ROUTINE_TEMPLATES: Record<string, { time: string; activity: string }[]> = {
  "Software Engineer": [
    { time: "7:00 AM", activity: "Wake up and morning routine" },
    { time: "7:30 AM", activity: "Quick exercise or stretching" },
    { time: "8:00 AM", activity: "Breakfast and check emails" },
    { time: "9:00 AM", activity: "Start focused coding work" },
    { time: "12:00 PM", activity: "Lunch break" },
    { time: "1:00 PM", activity: "Team meetings and collaboration" },
    { time: "3:00 PM", activity: "Continue development work" },
    { time: "6:00 PM", activity: "Wrap up work day" },
    { time: "6:30 PM", activity: "Dinner and relaxation" },
    { time: "8:00 PM", activity: "Personal projects or learning" },
    { time: "10:00 PM", activity: "Wind down and prepare for bed" },
    { time: "11:00 PM", activity: "Sleep" },
  ],
  Student: [
    { time: "6:30 AM", activity: "Wake up and morning routine" },
    { time: "7:00 AM", activity: "Breakfast and review day's schedule" },
    { time: "8:00 AM", activity: "Classes or study session" },
    { time: "12:00 PM", activity: "Lunch break" },
    { time: "1:00 PM", activity: "Afternoon classes or study" },
    { time: "4:00 PM", activity: "Extracurricular activities" },
    { time: "6:00 PM", activity: "Dinner" },
    { time: "7:00 PM", activity: "Homework and assignments" },
    { time: "9:00 PM", activity: "Review material and prepare for tomorrow" },
    { time: "10:00 PM", activity: "Personal time and relaxation" },
    { time: "11:00 PM", activity: "Sleep" },
  ],
  "Business Professional": [
    { time: "5:30 AM", activity: "Wake up and morning exercise" },
    { time: "6:30 AM", activity: "Shower and get ready" },
    { time: "7:00 AM", activity: "Breakfast and news review" },
    { time: "8:00 AM", activity: "Commute to work" },
    { time: "9:00 AM", activity: "Check emails and plan day" },
    { time: "10:00 AM", activity: "Meetings and calls" },
    { time: "12:00 PM", activity: "Lunch and networking" },
    { time: "1:00 PM", activity: "Focused work time" },
    { time: "3:00 PM", activity: "Team management and collaboration" },
    { time: "5:00 PM", activity: "Wrap up and plan next day" },
    { time: "6:00 PM", activity: "Commute home" },
    { time: "7:00 PM", activity: "Dinner and family time" },
    { time: "9:00 PM", activity: "Personal development or relaxation" },
    { time: "10:30 PM", activity: "Sleep" },
  ],
  "Healthcare Worker": [
    { time: "5:00 AM", activity: "Wake up and get ready" },
    { time: "5:30 AM", activity: "Quick breakfast" },
    { time: "6:00 AM", activity: "Commute to hospital/clinic" },
    { time: "7:00 AM", activity: "Shift handover" },
    { time: "7:30 AM", activity: "Patient rounds/appointments" },
    { time: "12:00 PM", activity: "Quick lunch break" },
    { time: "12:30 PM", activity: "Continue patient care" },
    { time: "4:00 PM", activity: "Documentation and handover" },
    { time: "5:00 PM", activity: "End shift and commute home" },
    { time: "6:00 PM", activity: "Dinner and relaxation" },
    { time: "8:00 PM", activity: "Self-care and unwinding" },
    { time: "9:30 PM", activity: "Sleep" },
  ],
  "Creative Professional": [
    { time: "7:30 AM", activity: "Wake up and morning routine" },
    { time: "8:00 AM", activity: "Breakfast and inspiration gathering" },
    { time: "9:00 AM", activity: "Creative work - most productive hours" },
    { time: "12:00 PM", activity: "Lunch break and short walk" },
    { time: "1:00 PM", activity: "Client meetings or collaborative work" },
    { time: "3:00 PM", activity: "Continue creative projects" },
    { time: "6:00 PM", activity: "Wrap up work day" },
    { time: "6:30 PM", activity: "Dinner" },
    { time: "7:30 PM", activity: "Explore new ideas or attend events" },
    { time: "10:00 PM", activity: "Wind down with reading or media" },
    { time: "11:30 PM", activity: "Sleep" },
  ],
  Chef: [
    { time: "7:00 AM", activity: "Wake up and quick breakfast" },
    { time: "8:00 AM", activity: "Menu planning and review" },
    { time: "9:00 AM", activity: "Arrive at restaurant/kitchen" },
    { time: "9:30 AM", activity: "Prep work and staff coordination" },
    { time: "11:00 AM", activity: "Pre-service meeting" },
    { time: "11:30 AM", activity: "Lunch service begins" },
    { time: "3:00 PM", activity: "Break between services" },
    { time: "4:00 PM", activity: "Dinner prep and staff management" },
    { time: "5:00 PM", activity: "Dinner service begins" },
    { time: "10:00 PM", activity: "Service ends, kitchen cleanup" },
    { time: "11:00 PM", activity: "Review day and plan tomorrow" },
    { time: "12:00 AM", activity: "Return home and unwind" },
    { time: "1:00 AM", activity: "Sleep" },
  ],
}

export function RoutineDisplay({ profession, tasks }: RoutineDisplayProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks)
  const [customizedRoutine, setCustomizedRoutine] = useState<{ time: string; activity: string }[]>([])

  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  // Generate a customized routine based on profession and tasks
  useEffect(() => {
    if (!profession) return

    // Start with the profession template
    let routine = [...(ROUTINE_TEMPLATES[profession] || [])]

    // Insert tasks with specific times
    localTasks.forEach((task) => {
      if (task.time) {
        // Try to format the time consistently
        let formattedTime = task.time
        if (!formattedTime.toUpperCase().includes("AM") && !formattedTime.toUpperCase().includes("PM")) {
          // Simple heuristic - if hour < 12, assume AM, else PM
          const hour = Number.parseInt(formattedTime.split(":")[0])
          formattedTime = `${formattedTime} ${hour < 12 ? "AM" : "PM"}`
        }

        // Add to routine
        routine.push({
          time: formattedTime,
          activity: task.title,
        })
      }
    })

    // Sort by time
    routine.sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime()
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime()
      return timeA - timeB
    })

    // Remove duplicates or very similar activities
    routine = routine.filter(
      (item, index, self) =>
        index === 0 || item.time !== self[index - 1].time || item.activity !== self[index - 1].activity,
    )

    setCustomizedRoutine(routine)
  }, [profession, localTasks])

  const handleTasksChange = (updatedTasks: Task[]) => {
    setLocalTasks(updatedTasks)
  }

  const handleDownloadRoutine = () => {
    // Create a text version of the routine
    const routineText = customizedRoutine.map((item) => `${item.time} - ${item.activity}`).join("\n")

    const blob = new Blob([routineText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${profession || "Custom"}_Routine.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{profession ? `${profession} Routine` : "Your Daily Routine"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadRoutine} disabled={!profession}>
            <Download className="h-4 w-4 mr-1" /> Save
          </Button>
          <Button variant="outline" size="sm" disabled={!profession}>
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>
        </div>
      </div>

      {!profession ? (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Routine Generated Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a profession in the chat tab to generate a customized daily routine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Daily Schedule
                <Badge variant="outline" className="ml-2">
                  {customizedRoutine.length} activities
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative pl-6 border-l">
                  {customizedRoutine.map((item, index) => (
                    <div key={index} className="mb-4 relative">
                      <div className="absolute -left-[22px] w-4 h-4 rounded-full bg-primary"></div>
                      <div className="font-medium text-sm">{item.time}</div>
                      <div className="text-sm mt-1">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <TaskList tasks={localTasks} onTasksChange={handleTasksChange} />
          </div>
        </div>
      )}
    </div>
  )
}
