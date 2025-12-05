'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, ChevronDown } from 'lucide-react'
import type { DisponibiliteType } from '@/types/database'

interface DisponibiliteToggleProps {
  productId: string
  currentValue: DisponibiliteType
}

const options: { value: DisponibiliteType; label: string; icon: typeof Eye; color: string }[] = [
  { value: 'disponible', label: 'Disponible', icon: Eye, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  { value: 'indisponible', label: 'Indisponible', icon: EyeOff, color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { value: 'masque', label: 'Masqué', icon: EyeOff, color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
]

export function DisponibiliteToggle({ productId, currentValue }: DisponibiliteToggleProps) {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(currentValue)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  const currentOption = options.find((o) => o.value === value) || options[0]
  const Icon = currentOption.icon

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [isOpen])

  const handleChange = async (newValue: DisponibiliteType) => {
    if (newValue === value) {
      setIsOpen(false)
      return
    }

    setLoading(true)
    setIsOpen(false)

    const supabase = createClient()
    const { error } = await supabase
      .from('produits')
      .update({ disponibilite: newValue, updated_at: new Date().toISOString() })
      .eq('id', productId)

    if (!error) {
      setValue(newValue)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${currentOption.color}`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Icon className="w-3 h-3" />
        )}
        {currentOption.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu déroulant - rendu via portail */}
          <div
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] min-w-[140px]"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            {options.map((option) => {
              const OptionIcon = option.icon
              const isSelected = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange(option.value)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                    isSelected ? 'font-medium' : ''
                  }`}
                >
                  <OptionIcon className="w-4 h-4" />
                  {option.label}
                  {isSelected && (
                    <span className="ml-auto text-belfrit-red">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
