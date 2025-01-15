export const useNumberFormat = (value: number) => {
  const formatter = new Intl.NumberFormat('en-US');
  return formatter.format(value);
};