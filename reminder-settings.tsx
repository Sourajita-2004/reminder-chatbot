"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, BellRing, Clock, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Task {
  id: string
  title: string
  time?: string
  completed: boolean
}

interface ReminderSetting {
  id: string
  enabled: boolean
  time: string
  type: "before" | "at" | "after"
  minutesBefore?: number
}

interface ReminderSettingsProps {
  tasks: Task[]
}

export function ReminderSettings({ tasks }: ReminderSettingsProps) {
  const [enableMorningSummary, setEnableMorningSummary] = useState(true)
  const [enableEveningWrapup, setEnableEveningWrapup] = useState(true)
  const [morningSummaryTime, setMorningSummaryTime] = useState("7:00 AM")
  const [eveningWrapupTime, setEveningWrapupTime] = useState("9:00 PM")
  const [taskReminders, setTaskReminders] = useState<Record<string, ReminderSetting[]>>({})

  // Initialize reminders for tasks that don't have them yet
  const tasksWithReminders = tasks.map((task) => {
    if (!taskReminders[task.id]) {
      taskReminders[task.id] = [
        {
          id: `${task.id}-before`,
          enabled: true,
          time: task.time || "9:00 AM",
          type: "before",
          minutesBefore: 15,
        },
      ]
    }
    return {
      ...task,
      reminders: taskReminders[task.id],
    }
  })

  const handleToggleReminder = (taskId: string, reminderId: string) => {
    setTaskReminders((prev) => {
      const updatedReminders = prev[taskId].map((reminder) =>
        reminder.id === reminderId ? { ...reminder, enabled: !reminder.enabled } : reminder,
      )
      return { ...prev, [taskId]: updatedReminders }
    })
  }

  const handleAddReminder = (taskId: string) => {
    setTaskReminders((prev) => {
      const newReminder: ReminderSetting = {
        id: `${taskId}-${Date.now()}`,
        enabled: true,
        time: prev[taskId][0]?.time || "9:00 AM",
        type: "before",
        minutesBefore: 15,
      }
      return {
        ...prev,
        [taskId]: [...(prev[taskId] || []), newReminder],
      }
    })
  }

  const handleRemoveReminder = (taskId: string, reminderId: string) => {
    setTaskReminders((prev) => {
      const updatedReminders = prev[taskId].filter((reminder) => reminder.id !== reminderId)
      return { ...prev, [taskId]: updatedReminders }
    })
  }

  const handleChangeReminderType = (taskId: string, reminderId: string, type: "before" | "at" | "after") => {
    setTaskReminders((prev) => {
      const updatedReminders = prev[taskId].map((reminder) =>
        reminder.id === reminderId ? { ...reminder, type } : reminder,
      )
      return { ...prev, [taskId]: updatedReminders }
    })
  }

  const handleChangeMinutesBefore = (taskId: string, reminderId: string, minutes: number) => {
    setTaskReminders((prev) => {
      const updatedReminders = prev[taskId].map((reminder) =>
        reminder.id === reminderId ? { ...reminder, minutesBefore: minutes } : reminder,
      )
      return { ...prev, [taskId]: updatedReminders }
    })
  }

  const handleSaveReminders = () => {
    // In a real app, this would save to a database or local storage
    alert("Reminder settings saved!")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reminder Settings</h2>
        <Button onClick={handleSaveReminders}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-4 w-4 mr-2" /> Daily Summaries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Morning Summary</Label>
                  <p className="text-sm text-muted-foreground">Get a summary of your day's tasks each morning</p>
                </div>
                <Switch checked={enableMorningSummary} onCheckedChange={setEnableMorningSummary} />
              </div>

              {enableMorningSummary && (
                <div className="ml-6 border-l pl-4 py-2">
                  <Label className="text-sm mb-1 block">Time</Label>
                  <Select value={morningSummaryTime} onValueChange={setMorningSummaryTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                      <SelectItem value="6:30 AM">6:30 AM</SelectItem>
                      <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                      <SelectItem value="7:30 AM">7:30 AM</SelectItem>
                      <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                      <SelectItem value="8:30 AM">8:30 AM</SelectItem>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="space-y-0.5">
                  <Label className="text-base">Evening Wrap-up</Label>
                  <p className="text-sm text-muted-foreground">Review completed tasks and plan for tomorrow</p>
                </div>
                <Switch checked={enableEveningWrapup} onCheckedChange={setEnableEveningWrapup} />
              </div>

              {enableEveningWrapup && (
                <div className="ml-6 border-l pl-4 py-2">
                  <Label className="text-sm mb-1 block">Time</Label>
                  <Select value={eveningWrapupTime} onValueChange={setEveningWrapupTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                      <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                      <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                      <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BellRing className="h-4 w-4 mr-2" /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive daily summaries via email</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Sound Alerts</Label>
                  <p className="text-sm text-muted-foreground">Play sound when reminders are triggered</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-4 w-4 mr-2" /> Task Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center p-4 border rounded-lg bg-muted/50">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No tasks added yet. Add tasks in the chat or routine tab to set reminders.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {tasksWithReminders.map((task) => (
                    <div key={task.id} className="border rounded-md p-3">
                      <div className="font-medium mb-2">{task.title}</div>
                      {task.time && (
                        <div className="text-xs text-muted-foreground mb-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> Scheduled for {task.time}
                        </div>
                      )}

                      <div className="space-y-3 mt-3">
                        {taskReminders[task.id]?.map((reminder) => (
                          <div
                            key={reminder.id}
                            className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={reminder.enabled}
                                onCheckedChange={() => handleToggleReminder(task.id, reminder.id)}
                                className="h-4 w-8"
                              />

                              <Select
                                value={reminder.type}
                                onValueChange={(value) => handleChangeReminderType(task.id, reminder.id, value as any)}
                              >
                                <SelectTrigger className="w-24 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="before">Before</SelectItem>
                                  <SelectItem value="at">At time</SelectItem>
                                  <SelectItem value="after">After</SelectItem>
                                </SelectContent>
                              </Select>

                              {reminder.type === "before" && (
                                <Select
                                  value={reminder.minutesBefore?.toString()}
                                  onValueChange={(value) =>
                                    handleChangeMinutesBefore(task.id, reminder.id, Number.parseInt(value))
                                  }
                                >
                                  <SelectTrigger className="w-24 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5">5 min</SelectItem>
                                    <SelectItem value="10">10 min</SelectItem>
                                    <SelectItem value="15">15 min</SelectItem>
                                    <SelectItem value="30">30 min</SelectItem>
                                    <SelectItem value="60">1 hour</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveReminder(task.id, reminder.id)}
                            >
                              <Bell className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleAddReminder(task.id)}
                        >
                          Add Reminder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
