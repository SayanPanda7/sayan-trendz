export function generateOrderNumber() {
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ST-${Date.now().toString().slice(-6)}-${randomPart}`;
}
