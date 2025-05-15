"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Plus, Trash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Task {
  id: string
  title: string
  time?: string
  completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  onTasksChange?: (tasks: Task[]) => void
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskTime, setNewTaskTime] = useState("")

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    onTasksChange?.(updatedTasks)
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Math.random().toString(36).substring(2),
        title: newTaskTitle.trim(),
        time: newTaskTime.trim() || undefined,
        completed: false,
      }
      onTasksChange?.([...tasks, newTask])
      setNewTaskTitle("")
      setNewTaskTime("")
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    onTasksChange?.(updatedTasks)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Time (optional)"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              className="w-32"
            />
            <Button size="icon" onClick={handleAddTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks yet. Add some tasks to get started.
              </p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                      id={`task-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.time && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.time}
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteTask(task.id)}>
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
