"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {

  const initialValue = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-slate-800 relative grow overflow-hidden rounded-full h-1.5 w-full"
      >

        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-cyan-500 absolute h-full"
        />
      </SliderPrimitive.Track>

      {(value || defaultValue || initialValue).map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className="border-cyan-500 block size-5 shrink-0 rounded-full border-2 bg-white shadow-sm transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
