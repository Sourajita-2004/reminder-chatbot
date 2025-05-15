"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap, Code, Stethoscope, Pencil, ChefHat } from "lucide-react"

interface ProfessionSelectorProps {
  onSelect: (profession: string) => void
}

const PROFESSIONS = [
  { name: "Software Engineer", icon: <Code className="h-4 w-4 mr-2" /> },
  { name: "Student", icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { name: "Business Professional", icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { name: "Healthcare Worker", icon: <Stethoscope className="h-4 w-4 mr-2" /> },
  { name: "Creative Professional", icon: <Pencil className="h-4 w-4 mr-2" /> },
  { name: "Chef", icon: <ChefHat className="h-4 w-4 mr-2" /> },
]

export function ProfessionSelector({ onSelect }: ProfessionSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {PROFESSIONS.map((profession) => (
        <Button
          key={profession.name}
          variant="outline"
          className="flex items-center justify-start"
          onClick={() => onSelect(profession.name)}
        >
          {profession.icon}
          {profession.name}
        </Button>
      ))}
    </div>
  )
}
