export function detectBridges(field) {
  if (field === "=" || field === "$") {
    return 2;
  }
  if (field === "-" || field === "|") {
    return 1;
  }
  if (field > 0 && field < 9) {
    return 3;
  }
  return 0;
}
