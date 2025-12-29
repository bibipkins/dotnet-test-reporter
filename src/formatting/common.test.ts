import { getSectionLink, getStatusIcon, formatElapsedTime } from './common';

describe('common formatting utilities', () => {
  describe('getSectionLink', () => {
    it('converts spaces to dashes and lowercases', () => {
      expect(getSectionLink('My Section')).toBe('my-section');
    });

    it('keeps existing hyphens and lowercases', () => {
      expect(getSectionLink('already-formatted')).toBe('already-formatted');
    });

    it('removes leading and trailing spaces', () => {
      expect(getSectionLink(' Leading Trailing  ')).toBe('leading-trailing');
    });
  });

  describe('getStatusIcon', () => {
    it('returns a check mark for success', () => {
      expect(getStatusIcon(true)).toBe('✔️');
    });

    it('returns a cross mark for failure', () => {
      expect(getStatusIcon(false)).toBe('❌');
    });
  });

  describe('formatElapsedTime', () => {
    it('formats milliseconds for short durations', () => {
      expect(formatElapsedTime(500)).toBe('500ms');
      expect(formatElapsedTime(0)).toBe('0ms');
    });

    it('formats seconds with one decimal when >= 1000ms and < 120000ms', () => {
      expect(formatElapsedTime(1000)).toBe('1s');
      expect(formatElapsedTime(1500)).toBe('1.5s');
      expect(formatElapsedTime(1999)).toBe('2s');
    });

    it('formats minutes for durations >= 120000ms', () => {
      expect(formatElapsedTime(120000)).toBe('2min');
      expect(formatElapsedTime(125000)).toBe('2.1min');
    });
  });
});
