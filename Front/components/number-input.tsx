"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

interface NumberInputProps {
  value: string
  onChange: (value: string) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

export function NumberInput({ value, onChange, min = 0, max = 999, step = 1, placeholder = "0" }: NumberInputProps) {
  const numValue = Number.parseInt(value) || 0

  const handleIncrement = () => {
    const newValue = Math.min(numValue + step, max)
    onChange(newValue.toString())
  }

  const handleDecrement = () => {
    const newValue = Math.max(numValue - step, min)
    onChange(newValue.toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      onChange("")
      return
    }
    const numVal = Number.parseInt(val)
    if (!Number.isNaN(numVal) && numVal >= min && numVal <= max) {
      onChange(numVal.toString())
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full bg-transparent"
        onClick={handleDecrement}
        disabled={numValue <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="text-center text-lg font-semibold"
        min={min}
        max={max}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full bg-transparent"
        onClick={handleIncrement}
        disabled={numValue >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
