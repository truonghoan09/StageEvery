import './FloatingInput.scss'

interface FloatingInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  error?: string | null
  onEnter?: () => void
}

export function FloatingInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  error,
  onEnter,
}: FloatingInputProps) {
  return (
    <div className="gg-input">
      <input
        id={id}
        type={type}
        value={value}
        placeholder=" "
        className={error ? 'has-error' : ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter()
          }
        }}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
