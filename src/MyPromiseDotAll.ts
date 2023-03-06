const checkIsIterable = <T>(toCheck: any): toCheck is Iterable<T> =>
  typeof toCheck[Symbol.iterator] === "function";

const myPromiseDotAll = <T>(iterable: Iterable<Promise<T>>): Promise<T[]> => {
  if (!checkIsIterable(iterable)) {
    throw new TypeError(
      "Input is not iterable. Please provide an iterable object."
    );
  }
  const promises: Promise<T>[] = Array.isArray(iterable)
    ? iterable
    : Array.from(iterable);

  if (!promises.length) return Promise.resolve([]);
  const total = promises.length;
  let current = 0;
  const resolved: T[] = Array(total);
  return new Promise((res, rej) => {
    promises.forEach(async (promise, i) => {
      try {
        resolved[i] = await promise;
        current++;
        if (current === total) {
          res(resolved);
        }
      } catch (e: unknown) {
        rej(e);
      }
    });
  });
};

export default myPromiseDotAll;
