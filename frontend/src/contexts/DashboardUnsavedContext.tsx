import { createContext, useContext, useState } from 'react'

type DashboardUnsavedContextType = {
  isDirty: boolean
  setIsDirty: (v: boolean) => void
}

const DashboardUnsavedContext =
  createContext<DashboardUnsavedContextType | null>(null)

export function DashboardUnsavedProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDirty, setIsDirty] = useState(false)

  return (
    <DashboardUnsavedContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </DashboardUnsavedContext.Provider>
  )
}

export function useDashboardUnsaved() {
  const ctx = useContext(DashboardUnsavedContext)
  if (!ctx) {
    throw new Error('useDashboardUnsaved must be used inside provider')
  }
  return ctx
}
