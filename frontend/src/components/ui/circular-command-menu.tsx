"use client"

import React, { useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CommandItem {
  id: string
  icon: ReactNode
  label: string
  shortcut?: string
  onClick?: () => void
}

export interface CircularCommandMenuProps {
  items?: CommandItem[]
  trigger?: ReactNode
  className?: string
  radius?: number
  startAngle?: number
  totalAngle?: number
  onSelect?: (item: CommandItem) => void
}

function Component({
  items = [],
  trigger,
  className,
  radius = 135,
  startAngle = -90,
  totalAngle = 360,
  onSelect,
}: CircularCommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerPos, setTriggerPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Defensive check for items
  const safeItems = items || []
  const itemCount = safeItems.length

  const angleStep =
    itemCount > 1
      ? totalAngle < 360
        ? totalAngle / (itemCount - 1)
        : totalAngle / itemCount
      : 0

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setTriggerPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setIsOpen((prev) => !prev)
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || itemCount === 0) return

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => (prev + 1) % itemCount)
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
          break
        case "Enter":
          e.preventDefault()
          const selectedItem = safeItems[activeIndex]
          if (selectedItem) {
            selectedItem.onClick?.()
            onSelect?.(selectedItem)
          }
          setIsOpen(false)
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          break
      }
    },
    [isOpen, activeIndex, safeItems, itemCount, onSelect],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const getItemPosition = (index: number) => {
    const angle = ((startAngle + index * angleStep) * Math.PI) / 180
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  const fanRadius = radius + 70

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        onClick={handleToggle}
        className={cn(
          "relative z-30 flex h-10 w-10 items-center justify-center rounded-xl",
          "border border-border bg-surface hover:bg-surface-2 text-text shadow-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer",
        )}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOpen ? "Close navigation menu" : "Open quick command menu"}
        title={isOpen ? "Close menu" : "Open quick menu"}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {trigger || (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Portal for Backdrop and Radial Menu Items */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[9999] pointer-events-auto">
                {/* Transparent dismiss backdrop — NO whole-page blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/10 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                />

                {/* Pure Circular Frosted Glass Blur directly behind menu options — NO border line, seamless blend */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  style={{
                    left: triggerPos.x - fanRadius,
                    top: triggerPos.y - fanRadius,
                    width: fanRadius * 2,
                    height: fanRadius * 2,
                    maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)",
                    WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)",
                  }}
                  className={cn(
                    "fixed z-[10000] pointer-events-none rounded-full",
                    "bg-bg/40 backdrop-blur-3xl"
                  )}
                />

                {/* Floating Close Button in exact position of trigger */}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  style={{
                    left: triggerPos.x - 20,
                    top: triggerPos.y - 20,
                  }}
                  className="fixed z-[10002] flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text shadow-sm cursor-pointer hover:bg-surface-2 focus:outline-none"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <motion.div animate={{ rotate: 45 }} transition={{ duration: 0.2 }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.div>
                </motion.button>

                {/* Radial Menu Items */}
                <div
                  className="fixed z-[10001]"
                  style={{
                    left: triggerPos.x,
                    top: triggerPos.y,
                  }}
                  role="menu"
                >
                  {safeItems.map((item, index) => {
                    const position = getItemPosition(index)
                    const isActive = activeIndex === index
                    const isLeftSide = position.x < -10

                    return (
                      <motion.button
                        key={item.id}
                        initial={{
                          opacity: 0,
                          x: 0,
                          y: 0,
                          scale: 0,
                        }}
                        animate={{
                          opacity: 1,
                          x: position.x - 22,
                          y: position.y - 22,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          x: 0,
                          y: 0,
                          scale: 0,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 440,
                          damping: 26,
                          delay: index * 0.035,
                        }}
                        onClick={() => {
                          item.onClick?.()
                          onSelect?.(item)
                          setIsOpen(false)
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "absolute flex h-11 w-11 items-center justify-center rounded-full cursor-pointer",
                          "border border-border bg-card shadow-lg",
                          "transition-colors hover:bg-secondary",
                          isActive && "ring-2 ring-primary bg-secondary",
                        )}
                        role="menuitem"
                        aria-label={item.label}
                      >
                        <div className="text-foreground">{item.icon}</div>

                        {/* Tooltip */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            scale: isActive ? 1 : 0.9,
                          }}
                          className={cn(
                            "absolute whitespace-nowrap rounded-md bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md border border-border pointer-events-none z-[10002]",
                            isLeftSide ? "right-full mr-3" : "left-full ml-3"
                          )}
                        >
                          <span className="font-medium">{item.label}</span>
                          {item.shortcut && (
                            <span className="ml-2 text-muted-foreground font-mono text-[10px]">
                              {item.shortcut}
                            </span>
                          )}
                        </motion.div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export { Component, Component as CircularCommandMenu }
export default Component
