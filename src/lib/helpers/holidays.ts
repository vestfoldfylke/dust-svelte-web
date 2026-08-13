const padout = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

const easter = (year: number): Date => {
  const C: number = Math.floor(year / 100);
  const N: number = year - 19 * Math.floor(year / 19);
  const K: number = Math.floor((C - 17) / 25);
  let I: number = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor(I / 30);
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J: number = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  const L: number = I - J;
  const M: number = 3 + Math.floor((L + 40) / 44);
  const D: number = L + 28 - 31 * Math.floor(M / 4);

  return new Date(`${padout(M)}.${padout(D)}.${year}`);
};

// Check if we are in the easter period (14 days before easter, or 4 days after easter)
export const isEaster = (): boolean => {
  const easterDate: Date = easter(new Date().getFullYear());
  const easterBeginning: Date = new Date(easterDate);
  easterBeginning.setDate(easterDate.getDate() - 14);
  const easterEnd: Date = new Date(easterDate);
  easterEnd.setDate(easterDate.getDate() + 4);

  const today: Date = new Date();
  return today >= easterBeginning && today <= easterEnd;
};

export const isChristmas = (): boolean => {
  const today: Date = new Date();
  return today.getMonth() === 11;
};
