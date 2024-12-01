
export const ThirtyDaysFromNow = ():Date => {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30));
  return thirtyDaysFromNow;
};