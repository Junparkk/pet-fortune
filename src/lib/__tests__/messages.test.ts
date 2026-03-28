import { MOODS, LUCKY_ITEMS, MESSAGES, ZODIAC_ANIMALS, ZODIAC_EMOJIS, ELEMENT_NAMES, ELEMENT_EMOJIS } from '../messages'

describe('message pools', () => {
  it('MOODS has exactly 5 entries', () => {
    expect(MOODS).toHaveLength(5)
    MOODS.forEach(mood => {
      expect(mood.label).toBeTruthy()
      expect(mood.emoji).toBeTruthy()
      expect(mood.reasons.length).toBeGreaterThan(0)
    })
  })

  it('LUCKY_ITEMS has at least 10 entries with name and emoji', () => {
    expect(LUCKY_ITEMS.length).toBeGreaterThanOrEqual(10)
    LUCKY_ITEMS.forEach(item => {
      expect(item.name).toBeTruthy()
      expect(item.emoji).toBeTruthy()
    })
  })

  it('MESSAGES has at least 20 entries', () => {
    expect(MESSAGES.length).toBeGreaterThanOrEqual(20)
    MESSAGES.forEach(msg => expect(msg).toBeTruthy())
  })

  it('ZODIAC arrays have exactly 12 entries', () => {
    expect(ZODIAC_ANIMALS).toHaveLength(12)
    expect(ZODIAC_EMOJIS).toHaveLength(12)
  })

  it('ELEMENT arrays have exactly 5 entries', () => {
    expect(ELEMENT_NAMES).toHaveLength(5)
    expect(ELEMENT_EMOJIS).toHaveLength(5)
  })
})
