export const getSectionLink = (section: string): string => section.toLowerCase().replace(/ /g, '-');

export const getStatusIcon = (success: boolean): string => (success ? '✔️' : '❌');

export const formatElapsedTime = (elapsed: number): string => {
  const secondsDelimiter = 1000;
  const minutesDelimiter = 120000;

  if (elapsed >= minutesDelimiter) {
    return `${Math.round(elapsed / 6000) / 10}min`;
  } else if (elapsed >= secondsDelimiter) {
    return `${Math.round(elapsed / 100) / 10}s`;
  } else {
    return `${elapsed}ms`;
  }
};
