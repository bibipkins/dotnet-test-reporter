export const normalize = (rate: number): number => {
  return Math.round(rate * 10000) / 100;
};
