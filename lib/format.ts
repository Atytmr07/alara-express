// Turkish-locale price formatting, e.g. 1600 -> "1.600 ₺".
export function formatPrice(price: number): string {
  const value = Number.isFinite(price) ? price : 0;
  return `${value.toLocaleString("tr-TR")} ₺`;
}

// Energy per portion, e.g. 520 -> "520 kcal".
export function formatCalories(calories: number): string {
  const value = Number.isFinite(calories) ? Math.round(calories) : 0;
  return `${value.toLocaleString("tr-TR")} kcal`;
}
