import {
  MOODS, LUCKY_ITEMS, MESSAGES,
  ZODIAC_ANIMALS, ZODIAC_EMOJIS,
  ELEMENT_NAMES, ELEMENT_EMOJIS,
  BIRTHDAY_MESSAGE,
} from './messages'

export interface FortuneResult {
  moodLevel:     number
  moodLabel:     string
  moodEmoji:     string
  moodReason:    string
  luckyItem:     string
  luckyItemEmoji:string
  message:       string
  zodiacAnimal:  string
  zodiacEmoji:   string
  element:       string
  elementEmoji:  string
  isBirthdayWeek:boolean
  petName:       string
}

// Month index (0=Jan) → element index (0=木 1=火 2=土 3=金 4=水)
const MONTH_TO_ELEMENT = [4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0]

export function hashString(s: string): number {
  return s.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0)
}

export function getZodiacIndex(birthYear: number): number {
  return ((birthYear - 4) % 12 + 12) % 12
}

export function getPetElement(birthMonth: number): number {
  return MONTH_TO_ELEMENT[birthMonth]
}

// diff = (todayElement - petElement + 5) % 5
// 0 → 0, 1 → +2 (생), 4 → +1 (역생), 2 → -1 (극), 3 → -2 (역극)
export function getElementCompatibility(petElement: number, todayElement: number): number {
  const diff = ((todayElement - petElement) % 5 + 5) % 5
  if (diff === 0) return  0
  if (diff === 1) return  2
  if (diff === 4) return  1
  if (diff === 2) return -1
  return -2
}

export function checkBirthdayWeek(birthday: Date, today: Date): boolean {
  const yr = today.getFullYear()
  const todayDateOnly = new Date(yr, today.getMonth(), today.getDate())
  let next = new Date(yr, birthday.getMonth(), birthday.getDate())
  if (next < todayDateOnly) {
    next = new Date(yr + 1, birthday.getMonth(), birthday.getDate())
  }
  const diffDays = Math.floor((next.getTime() - todayDateOnly.getTime()) / 86_400_000)
  return diffDays <= 7
}

export function getFortuneResult(petName: string, birthday: Date, today: Date): FortuneResult {
  const nameHash     = hashString(petName)
  const petElement   = getPetElement(birthday.getMonth())
  const todayElement = today.getDate() % 5
  const compat       = getElementCompatibility(petElement, todayElement)
  const zodiacIndex  = getZodiacIndex(birthday.getFullYear())

  const dayFactor  = (today.getDay() + today.getDate() + nameHash) % 5
  const moodLevel  = ((compat + 2) + dayFactor) % 5

  const luckyIndex   = (nameHash + zodiacIndex + today.getMonth() + today.getDate()) % LUCKY_ITEMS.length
  const messageIndex = (nameHash + today.getDate() * 7 + today.getMonth() * 31) % MESSAGES.length

  const isBirthdayWeek = checkBirthdayWeek(birthday, today)

  return {
    moodLevel,
    moodLabel:     MOODS[moodLevel].label,
    moodEmoji:     MOODS[moodLevel].emoji,
    moodReason:    MOODS[moodLevel].reasons[(nameHash + today.getDate()) % MOODS[moodLevel].reasons.length],
    luckyItem:     LUCKY_ITEMS[luckyIndex].name,
    luckyItemEmoji:LUCKY_ITEMS[luckyIndex].emoji,
    message: isBirthdayWeek ? BIRTHDAY_MESSAGE : MESSAGES[messageIndex],
    zodiacAnimal:  ZODIAC_ANIMALS[zodiacIndex],
    zodiacEmoji:   ZODIAC_EMOJIS[zodiacIndex],
    element:       ELEMENT_NAMES[petElement],
    elementEmoji:  ELEMENT_EMOJIS[petElement],
    isBirthdayWeek,
    petName,
  }
}
