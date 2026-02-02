export const getNextSpot = (regs) => {
  const used = regs.map(r => r.spotNumber);
  let i = 1;
  while (used.includes(i)) i++;
  return i;
};
