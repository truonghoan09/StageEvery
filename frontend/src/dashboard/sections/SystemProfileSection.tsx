import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FloatingInput } from '../../components/FloatingInput'
import {
  createSystemProfile,
  getSystemProfile,
} from '../../services/user.service'

import './SystemProfileSection.scss'

type Props = {
  refreshSystemProfile?: () => Promise<void>
}

/* =========================
   VALIDATORS
========================= */

const isValidName = (name: string) =>
  /^[A-Za-zÀ-ỹ\s'-]+$/.test(name.trim())

const normalizePhoneVN = (raw: string) => {
  let phone = raw.replace(/\D/g, '')

  if (phone.startsWith('84')) {
    phone = '0' + phone.slice(2)
  }

  if (phone.startsWith('084') && phone.length === 11) {
    phone = phone.slice(1)
  }

  return phone
}

const isValidPhoneVN = (phone: string) => {
  return /^0(3|5|7|8|9)\d{8}$/.test(phone)
}

const isValidDOB = (dob: string) => {
  if (!dob) return false

  const birth = new Date(dob)
  const today = new Date()

  if (birth > today) return false

  const age =
    today.getFullYear() - birth.getFullYear()

  return age >= 13
}

export default function SystemProfileSection({
  refreshSystemProfile,
}: Props) {
  const { t } = useTranslation()

  /* =========================
     FIELD STATES
  ========================= */

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  // DOB (YYYY-MM-DD)
  const [dob, setDob] = useState('')
  const [dobDay, setDobDay] = useState('')
  const [dobMonth, setDobMonth] = useState('')
  const [dobYear, setDobYear] = useState('')

  /* =========================
     ERROR PER FIELD
  ========================= */

  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    phone?: string
    dob?: string
  }>({})

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  /* =========================
     HELPERS
  ========================= */

  const clamp = (
    value: number,
    min: number,
    max: number
  ) => Math.min(Math.max(value, min), max)

  const currentYear = new Date().getFullYear()

  /* =========================
     DOB INPUT HANDLERS
  ========================= */

  const handleDayChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 2)
    setDobDay(v)
  }

  const handleMonthChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 2)
    setDobMonth(v)
  }

  const handleYearChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setDobYear(v)
  }

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: 'day' | 'month' | 'year'
  ) => {
    if (e.key !== 'Backspace') return

    if (field === 'month' && dobMonth === '') {
      document.getElementById('dob-day')?.focus()
    }

    if (field === 'year' && dobYear === '') {
      document.getElementById('dob-month')?.focus()
    }
  }

  /* =========================
     BUILD DOB VALUE (CHO PHÉP 1 SỐ)
  ========================= */

  useEffect(() => {
    if (!dobDay || !dobMonth || !dobYear) {
      setDob('')
      return
    }

    const day = clamp(Number(dobDay), 1, 31)
      .toString()
      .padStart(2, '0')

    const month = clamp(Number(dobMonth), 1, 12)
      .toString()
      .padStart(2, '0')

    const year = clamp(
      Number(dobYear),
      1900,
      currentYear
    ).toString()

    const builtDob = `${year}-${month}-${day}`
    setDob(builtDob)

    if (isValidDOB(builtDob)) {
      setErrors((e) => ({ ...e, dob: undefined }))
    }
  }, [dobDay, dobMonth, dobYear])

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getSystemProfile()
        if (!profile) return

        setFirstName(profile.firstName)
        setLastName(profile.lastName)
        setPhone(profile.phone)

        if (profile.dob) {
          const [y, m, d] = profile.dob.split('-')
          setDobYear(y)
          setDobMonth(m)
          setDobDay(d)
        }
      } catch {
        // ignore
      }
    }

    loadProfile()
  }, [])

  /* =========================
     SAVE (FIX CHÍNH Ở ĐÂY)
  ========================= */

  const handleSave = async () => {
    setSuccess(false)

    const newErrors: typeof errors = {}

    if (!firstName || !isValidName(firstName)) {
      newErrors.firstName = t(
        'dashboard.systemProfile.errors.invalidName'
      )
    }

    if (!lastName || !isValidName(lastName)) {
      newErrors.lastName = t(
        'dashboard.systemProfile.errors.invalidName'
      )
    }

    const normalizedPhone = normalizePhoneVN(phone)

    if (!normalizedPhone || !isValidPhoneVN(normalizedPhone)) {
      newErrors.phone = t(
        'dashboard.systemProfile.errors.invalidPhone'
      )
    }

    if (!dob || !isValidDOB(dob)) {
      newErrors.dob = t(
        'dashboard.systemProfile.errors.invalidDob'
      )
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // ✅ QUAN TRỌNG: CLEAR ERROR TRƯỚC KHI SUBMIT
    setErrors({});


    const payload = {
      firstName,
      lastName,
      phone: normalizedPhone,
      dob,
    }

    console.log(
      '[SystemProfile] Submit valid data:',
      payload
    )

    try {
      setLoading(true)
      await createSystemProfile(payload)
      await refreshSystemProfile?.()
      setSuccess(true)
    } catch {
      // ❌ không gắn lỗi hệ thống vào field
      // TODO: show toast / banner sau
    }finally {
      setLoading(false)
    }
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <section className="system-profile-section">
      <h2>{t('dashboard.systemProfile.title')}</h2>
      <p className="hint">
        {t('dashboard.systemProfile.subtitle')}
      </p>

      <div className="form">
        <FloatingInput
          id="firstName"
          label={t('dashboard.systemProfile.firstName')}
          value={firstName}
          onChange={(v) => {
            setFirstName(v)
            if (isValidName(v)) {
              setErrors((e) => ({ ...e, firstName: undefined }))
            }
          }}
          error={!!errors.firstName}
        />

        <FloatingInput
          id="lastName"
          label={t('dashboard.systemProfile.lastName')}
          value={lastName}
          onChange={(v) => {
            setLastName(v)
            if (isValidName(v)) {
              setErrors((e) => ({ ...e, lastName: undefined }))
            }
          }}
          error={!!errors.lastName}
        />

        <FloatingInput
          id="phone"
          label={t('dashboard.systemProfile.phone')}
          value={phone}
          onChange={(v) => {
            const normalized = normalizePhoneVN(v)
            setPhone(normalized)

            if (isValidPhoneVN(normalized)) {
              setErrors((e) => ({ ...e, phone: undefined }))
            }
          }}
          error={!!errors.phone}
        />

        <div className="dob-field">
          <label className="dob-label">
            {t('dashboard.systemProfile.dob')}
          </label>

          <div className="dob-inputs">
            <input
              id="dob-day"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="DD"
              value={dobDay}
              onChange={handleDayChange}
              onKeyDown={(e) =>
                handleBackspace(e, 'day')
              }
            />

            <span className="dob-sep">/</span>

            <input
              id="dob-month"
              type="text"
              inputMode="numeric"
              maxLength={2}
              placeholder="MM"
              value={dobMonth}
              onChange={handleMonthChange}
              onKeyDown={(e) =>
                handleBackspace(e, 'month')
              }
            />

            <span className="dob-sep">/</span>

            <input
              id="dob-year"
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="YYYY"
              value={dobYear}
              onChange={handleYearChange}
              onKeyDown={(e) =>
                handleBackspace(e, 'year')
              }
            />
          </div>

          {errors.dob && (
            <p className="error">{errors.dob}</p>
          )}
        </div>
      </div>

      {success && (
        <p className="success">
          {t('dashboard.systemProfile.success')}
        </p>
      )}

      <button
        className="save-btn"
        onClick={handleSave}
        disabled={loading}
      >
        {loading
          ? t('dashboard.systemProfile.saving')
          : t('dashboard.systemProfile.save')}
      </button>
    </section>
  )
}
