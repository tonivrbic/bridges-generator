export function detectBridges(field: string | number) {
  if (field === "=" || field === "$") {
    return 2;
  }
  if (field === "-" || field === "|") {
    return 1;
  }
  if (typeof field === "number" && field > 0 && field < 9) {
    return 3;
  }
  return 0;
}
