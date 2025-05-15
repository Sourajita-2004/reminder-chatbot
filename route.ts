import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Define profession-based routine templates
const PROFESSION_TEMPLATES = {
  "software engineer": `
- 7:00 AM: Wake up and morning routine
- 7:30 AM: Quick exercise or stretching
- 8:00 AM: Breakfast and check emails
- 9:00 AM: Start focused coding work
- 12:00 PM: Lunch break
- 1:00 PM: Team meetings and collaboration
- 3:00 PM: Continue development work
- 6:00 PM: Wrap up work day
- 6:30 PM: Dinner and relaxation
- 8:00 PM: Personal projects or learning
- 10:00 PM: Wind down and prepare for bed
- 11:00 PM: Sleep
  `,
  student: `
- 6:30 AM: Wake up and morning routine
- 7:00 AM: Breakfast and review day's schedule
- 8:00 AM: Classes or study session
- 12:00 PM: Lunch break
- 1:00 PM: Afternoon classes or study
- 4:00 PM: Extracurricular activities
- 6:00 PM: Dinner
- 7:00 PM: Homework and assignments
- 9:00 PM: Review material and prepare for tomorrow
- 10:00 PM: Personal time and relaxation
- 11:00 PM: Sleep
  `,
  "business professional": `
- 5:30 AM: Wake up and morning exercise
- 6:30 AM: Shower and get ready
- 7:00 AM: Breakfast and news review
- 8:00 AM: Commute to work
- 9:00 AM: Check emails and plan day
- 10:00 AM: Meetings and calls
- 12:00 PM: Lunch and networking
- 1:00 PM: Focused work time
- 3:00 PM: Team management and collaboration
- 5:00 PM: Wrap up and plan next day
- 6:00 PM: Commute home
- 7:00 PM: Dinner and family time
- 9:00 PM: Personal development or relaxation
- 10:30 PM: Sleep
  `,
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Extract the user's latest message
  const userMessage = messages.filter((m: any) => m.role === "user").pop()?.content || ""

  // Check if the message is about profession
  const professionMatch =
    userMessage.match(/profession is (.*?)$/i) ||
    userMessage.match(/I am a (.*?)$/i) ||
    userMessage.match(/I work as a (.*?)$/i)

  // Check if the message is about tasks
  const taskRelated =
    userMessage.includes("task") ||
    userMessage.includes("todo") ||
    userMessage.includes("schedule") ||
    userMessage.includes("plan") ||
    userMessage.includes("meeting") ||
    userMessage.includes("appointment")

  // Check if it's a suggestion request
  const suggestionRequest =
    userMessage.includes("What should I do now") ||
    userMessage.includes("have 1 hour free") ||
    userMessage.includes("suggest a task") ||
    userMessage.includes("recommend")

  // Check if it's a routine generation request
  const routineRequest =
    userMessage.includes("Generate a daily routine") ||
    userMessage.includes("Create a routine") ||
    userMessage.includes("Make a schedule")

  // Check if it's a reminder request
  const reminderRequest =
    userMessage.includes("reminder") || userMessage.includes("notify") || userMessage.includes("alert")

  // Determine the type of response needed
  let systemPrompt = `You are a professional daily routine management assistant. 
You help users plan their day based on their profession and tasks.
Be formal and professional in your responses.
When generating routines or schedules, format them clearly.
When listing tasks, always prefix with TASKS: and then list each task on a new line.`

  // Customize the system prompt based on the request type
  if (professionMatch) {
    const profession = professionMatch[1].toLowerCase().trim()
    systemPrompt += `\n\nThe user has indicated they are a ${profession}. 
Provide a tailored daily routine for a ${profession} would typically follow.
Include appropriate wake-up times, meal times, work periods, and rest periods.
If you know a template for this profession, use it as a starting point.`

    // Add profession template if available
    if (PROFESSION_TEMPLATES[profession]) {
      systemPrompt += `\n\nHere's a template for ${profession}:\n${PROFESSION_TEMPLATES[profession]}`
    }
  } else if (taskRelated) {
    systemPrompt += `\n\nThe user is mentioning tasks. 
Extract any tasks from their message and organize them into a schedule.
For tasks with specific times, schedule them at those times.
For flexible tasks, suggest appropriate time slots based on typical daily routines.
Always format the tasks list with the prefix TASKS: followed by each task on a new line.`
  } else if (suggestionRequest) {
    systemPrompt += `\n\nThe user is asking for a suggestion on what to do.
Based on the current time of day and any known tasks, suggest an appropriate activity.
Consider productivity principles, work-life balance, and typical routines for their profession if known.`
  } else if (routineRequest) {
    systemPrompt += `\n\nThe user wants a complete daily routine.
Generate a comprehensive schedule from wake-up to bedtime.
Include appropriate times for meals, work, breaks, exercise, and personal time.
If you know their profession, tailor the routine accordingly.
Format the routine as a clear schedule with times and activities.`
  } else if (reminderRequest) {
    systemPrompt += `\n\nThe user is interested in reminders.
Explain how the reminder system works, including:
- Morning summaries of the day's tasks
- Notifications before scheduled tasks
- End-of-day wrap-ups
Suggest appropriate reminder settings based on their routine if known.`
  }

  // Generate the response using AI SDK
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: userMessage,
    temperature: 0.7,
    maxTokens: 1000,
  })

  // Return the response
  return new Response(text)
}
