export async function sleepAsync(ms: number): Promise<null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(null);
    }, ms);
  });
}
