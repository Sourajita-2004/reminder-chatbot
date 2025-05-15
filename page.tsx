import { Chat } from "@/components/chat"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-xl font-bold">Daily Routine Assistant</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-between p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Chat />
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex justify-center text-sm text-muted-foreground">
          Daily Routine Assistant © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
