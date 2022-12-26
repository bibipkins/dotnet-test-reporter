export const normalize = (rate: number) => {
  return Math.round(rate * 10000) / 100;
};
