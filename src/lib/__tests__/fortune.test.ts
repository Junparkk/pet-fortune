import {
  hashString,
  getZodiacIndex,
  getPetElement,
  getElementCompatibility,
  checkBirthdayWeek,
  getFortuneResult,
} from '../fortune'
import { MOODS, MESSAGES, LUCKY_ITEMS, CAT_MESSAGES, CAT_LUCKY_ITEMS } from '../messages'

describe('hashString', () => {
  it('is deterministic', () => {
    expect(hashString('희동이')).toBe(hashString('희동이'))
  })
  it('returns different values for different strings', () => {
    expect(hashString('멍멍이')).not.toBe(hashString('야옹이'))
  })
  it('returns 0 for empty string', () => {
    expect(hashString('')).toBe(0)
  })
})

describe('getZodiacIndex', () => {
  it('returns 0 for 2020 (year of the rat)', () => {
    // (2020 - 4) % 12 = 2016 % 12 = 0
    expect(getZodiacIndex(2020)).toBe(0)
  })
  it('returns 2 for 2022 (year of the tiger)', () => {
    // (2022 - 4) % 12 = 2018 % 12 = 2
    expect(getZodiacIndex(2022)).toBe(2)
  })
  it('always returns value in 0-11', () => {
    [1980, 1990, 2000, 2019, 2020, 2021, 2022, 2023, 2024].forEach(year => {
      const idx = getZodiacIndex(year)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThanOrEqual(11)
    })
  })
})

describe('getPetElement', () => {
  it('maps January (0) to Water (4)', () => {
    expect(getPetElement(0)).toBe(4)
  })
  it('maps February (1) to Wood (0)', () => {
    expect(getPetElement(1)).toBe(0)
  })
  it('maps May (4) to Fire (1)', () => {
    expect(getPetElement(4)).toBe(1)
  })
  it('maps July (6) to Earth (2)', () => {
    expect(getPetElement(6)).toBe(2)
  })
  it('always returns value in 0-4', () => {
    for (let m = 0; m < 12; m++) {
      const el = getPetElement(m)
      expect(el).toBeGreaterThanOrEqual(0)
      expect(el).toBeLessThanOrEqual(4)
    }
  })
})

describe('getElementCompatibility', () => {
  it('returns 0 for same element', () => {
    expect(getElementCompatibility(0, 0)).toBe(0)
  })
  it('returns 2 for generating cycle (Wood→Fire)', () => {
    expect(getElementCompatibility(0, 1)).toBe(2)
  })
  it('returns -2 for being controlled (Wood←Metal, diff=3)', () => {
    expect(getElementCompatibility(0, 3)).toBe(-2)
  })
  it('always returns value in -2 to 2', () => {
    for (let p = 0; p < 5; p++) {
      for (let t = 0; t < 5; t++) {
        const c = getElementCompatibility(p, t)
        expect(c).toBeGreaterThanOrEqual(-2)
        expect(c).toBeLessThanOrEqual(2)
      }
    }
  })
})

describe('checkBirthdayWeek', () => {
  it('returns true when birthday is today', () => {
    const today = new Date(2026, 2, 26)
    const birthday = new Date(2020, 2, 26)
    expect(checkBirthdayWeek(birthday, today)).toBe(true)
  })
  it('returns true when birthday is 5 days away', () => {
    const today = new Date(2026, 2, 26)
    const birthday = new Date(2020, 2, 31)
    expect(checkBirthdayWeek(birthday, today)).toBe(true)
  })
  it('returns false when birthday is 30 days away', () => {
    const today = new Date(2026, 2, 26)
    const birthday = new Date(2020, 3, 25)
    expect(checkBirthdayWeek(birthday, today)).toBe(false)
  })
})

describe('getFortuneResult', () => {
  const petName = '희동이'
  const birthday = new Date(2020, 4, 15) // May 15, 2020
  const today = new Date(2026, 2, 26)    // March 26, 2026

  it('returns a complete FortuneResult', () => {
    const r = getFortuneResult(petName, birthday, today)
    expect(r.moodLevel).toBeGreaterThanOrEqual(0)
    expect(r.moodLevel).toBeLessThanOrEqual(4)
    expect(r.moodLabel).toBeTruthy()
    expect(r.moodEmoji).toBeTruthy()
    expect(r.moodReason).toBeTruthy()
    expect(r.luckyItem).toBeTruthy()
    expect(r.luckyItemEmoji).toBeTruthy()
    expect(r.message).toBeTruthy()
    expect(r.zodiacAnimal).toBeTruthy()
    expect(r.zodiacEmoji).toBeTruthy()
    expect(r.element).toBeTruthy()
    expect(r.elementEmoji).toBeTruthy()
    expect(r.petName).toBe(petName)
  })

  it('is deterministic — same inputs always give same output', () => {
    const r1 = getFortuneResult(petName, birthday, today)
    const r2 = getFortuneResult(petName, birthday, today)
    expect(r1).toEqual(r2)
  })

  it('produces different output on a different day', () => {
    const tomorrow = new Date(2026, 2, 27)
    const r1 = getFortuneResult(petName, birthday, today)
    const r2 = getFortuneResult(petName, birthday, tomorrow)
    const differs = r1.moodLevel !== r2.moodLevel ||
                    r1.luckyItem !== r2.luckyItem ||
                    r1.message   !== r2.message
    expect(differs).toBe(true)
  })
})

describe('getFortuneResult — reasons array', () => {
  const today = new Date('2026-03-28')
  const birthday = new Date('2018-05-10')

  it('moodReason은 해당 기분의 reasons 배열 중 하나여야 한다', () => {
    const result = getFortuneResult('초코', birthday, today)
    const mood = MOODS[result.moodLevel]
    expect(mood.reasons).toContain(result.moodReason)
  })

  it('같은 입력은 항상 같은 moodReason을 반환한다', () => {
    const r1 = getFortuneResult('초코', birthday, today)
    const r2 = getFortuneResult('초코', birthday, today)
    expect(r1.moodReason).toBe(r2.moodReason)
  })

  it('MESSAGES 길이는 100이다', () => {
    expect(MESSAGES.length).toBe(100)
  })

  it('LUCKY_ITEMS 길이는 50이다', () => {
    expect(LUCKY_ITEMS.length).toBe(50)
  })
})

describe('cat 데이터', () => {
  it('CAT_MESSAGES 길이는 100이다', () => {
    expect(CAT_MESSAGES.length).toBe(100)
  })

  it('CAT_LUCKY_ITEMS 길이는 50이다', () => {
    expect(CAT_LUCKY_ITEMS.length).toBe(50)
  })

  it('모든 MOODS에 catReasons가 3개씩 있다', () => {
    MOODS.forEach(mood => {
      expect(mood.catReasons).toBeDefined()
      expect(mood.catReasons.length).toBe(3)
    })
  })
})
