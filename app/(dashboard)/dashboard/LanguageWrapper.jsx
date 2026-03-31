'use client'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

export default function LanguageWrapper({ initialLang, children }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      {children}
    </LanguageProvider>
  )
}
