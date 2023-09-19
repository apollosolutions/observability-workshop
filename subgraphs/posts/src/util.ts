export const totallyComplicatedAndNecessaryLogic = (
  ms: number
): Promise<string> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve("totally necessary"), ms)
  );
};
