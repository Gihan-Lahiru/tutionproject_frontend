/**
 * Shared helpers for Student & Teacher Dashboard compatibility:
 * - Backend asset/avatar URL resolution
 * - Unified Grade normalization (including Grade 6-11 and A/L <-> Grade 12/13)
 * - Resilient Institute matching
 * - Safe Date formatting & API payload array extraction
 */

export function getBackendOrigin() {
  const origin =
    import.meta.env.VITE_BACKEND_ORIGIN ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000'
  return String(origin).replace(/\/api\/?$/, '')
}

export function resolveAssetUrl(value) {
  if (!value) return ''
  const raw = String(value).trim().replace(/\\/g, '/')
  if (!raw) return ''
  if (
    raw.startsWith('http://') ||
    raw.startsWith('https://') ||
    raw.startsWith('data:') ||
    raw.startsWith('blob:')
  ) {
    return raw
  }
  const base = getBackendOrigin()
  return raw.startsWith('/') ? `${base}${raw}` : `${base}/${raw}`
}

export function normalizeGradeKey(value) {
  if (value == null) return ''
  const raw = String(value).trim()
  if (!raw) return ''

  const lower = raw.toLowerCase()
  if (lower.includes('a/l') || lower === 'al' || lower.startsWith('al ')) {
    return 'al'
  }

  const digits = raw.match(/\d+/)?.[0]
  if (digits) {
    if (digits === '12' || digits === '13') return 'al'
    return digits
  }

  return lower.replace(/^grade\s*/i, '').trim()
}

export function gradesMatch(itemGrade, userGrade, { allowEmptyItem = false } = {}) {
  const userKey = normalizeGradeKey(userGrade)
  if (!userKey) return true

  const itemKey = normalizeGradeKey(itemGrade)
  if (!itemKey) return allowEmptyItem

  return itemKey === userKey
}

export function formatGradeLabel(value) {
  const raw = String(value || '').trim()
  if (!raw) return 'Not set'
  const lower = raw.toLowerCase()
  if (lower === 'a/l' || lower === 'al' || lower.includes('a/l')) {
    return 'A/L Chemistry'
  }
  const digits = raw.match(/\d+/)?.[0]
  if (digits) return `Grade ${digits}`
  if (/^grade\s+/i.test(raw)) return raw.replace(/^grade\s+/i, 'Grade ')
  return raw
}

export function normalizeInstitute(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[-–—_,./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function institutesMatch(classLocationOrInstitute, userInstitute) {
  const userNorm = normalizeInstitute(userInstitute)
  const itemNorm = normalizeInstitute(classLocationOrInstitute)
  if (!userNorm || !itemNorm) return true
  return userNorm === itemNorm || userNorm.includes(itemNorm) || itemNorm.includes(userNorm)
}

export function parseAppDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const raw = String(value).trim()
  if (!raw) return null
  const sqliteMatch = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/
  )
  if (sqliteMatch) {
    const [, y, m, d, hh = '00', mm = '00', ss = '00'] = sqliteMatch
    const parsed = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss)
    )
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatShortDate(value, fallback = 'Recent') {
  const parsed = parseAppDate(value)
  if (!parsed) return fallback
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function extractArray(payload, ...keys) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []
  for (const key of keys) {
    if (Array.isArray(payload[key])) return payload[key]
  }
  return []
}

