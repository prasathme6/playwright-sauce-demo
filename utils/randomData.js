/** Small unique checkout values so parallel runs do not share identical typed strings. */
export function randomCheckoutInfo() {
  const stamp = Date.now().toString(36);
  return {
    firstName: `Pat${stamp.slice(-4)}`,
    lastName: `Lee${stamp.slice(-3)}`,
    postalCode: String(10000 + (Date.now() % 89999)),
  };
}
