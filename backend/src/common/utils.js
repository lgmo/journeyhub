export function getUTCDate(date) {
  return new Date(new Date(date).toUTCString());
}
