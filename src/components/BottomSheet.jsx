import { useState, useRef, useEffect } from 'react'

const SHEET_POSITIONS = {
  COLLAPSED: 200,
  HALF: window.innerHeight * 0.5,
  EXPANDED: window.innerHeight * 0.85
}

export default function BottomSheet({ children }) {
  const [height, setHeight] = useState(SHEET_POSITIONS.COLLAPSED)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)
  const startHeight = useRef(0)

  const handleDragStart = (e) => {
    setIsDragging(true)
    startY.current = e.touches ? e.touches[0].clientY : e.clientY
    startHeight.current = height
  }

  const handleDrag = (e) => {
    if (!isDragging) return

    const currentY = e.touches ? e.touches[0].clientY : e.clientY
    const delta = startY.current - currentY
    const newHeight = Math.max(
      SHEET_POSITIONS.COLLAPSED,
      Math.min(SHEET_POSITIONS.EXPANDED, startHeight.current + delta)
    )

    setHeight(newHeight)
  }

  const handleDragEnd = () => {
    setIsDragging(false)

    // Snap to nearest position
    const positions = Object.values(SHEET_POSITIONS)
    const nearest = positions.reduce((prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
    )

    setHeight(nearest)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDrag)
      window.addEventListener('touchend', handleDragEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleDrag)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDrag)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, height])

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0
        bg-surface-900 rounded-t-3xl shadow-2xl
        border-t border-surface-700
        transition-height duration-300 ease-out
        ${isDragging ? '' : 'transition-all'}
      `}
      style={{ height: `${height}px` }}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center py-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="w-12 h-1.5 bg-surface-600 rounded-full" />
      </div>

      {/* Content */}
      <div className="h-full overflow-y-auto px-2 pb-10">
        {children}
      </div>
    </div>
  )
}
