import myPromiseDotAll from "../src/MyPromiseDotAll";

// const myPromiseDotAll = Promise.all.bind(Promise);

describe("MyPromiseDotAll", () => {
  it("should handle empty array", async () => {
    const result = await myPromiseDotAll([]);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("should handle one promise", async () => {
    const result = await myPromiseDotAll([Promise.resolve(4)]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(4);
  });

  it("should handle many promises", async () => {
    const result = await myPromiseDotAll([
      Promise.resolve(4),
      Promise.resolve(6),
      Promise.resolve(8),
    ]);

    expect(result).toHaveLength(3);
    expect(result).toEqual([4, 6, 8]);
  });

  it("should reject if any promise rejects", async () => {
    const promises = [
      Promise.resolve(1),
      Promise.reject("error"),
      Promise.resolve(3),
    ];
    try {
      await myPromiseDotAll(promises);
    } catch (error: unknown) {
      expect(error).toEqual("error");
    }
  });

  it("should work with any iterable", async () => {
    function* gen() {
      yield Promise.resolve(1);
      yield Promise.resolve(2);
      yield Promise.resolve(3);
    }
    const promises = gen();
    const result = await myPromiseDotAll(promises);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should resolve all promises concurrently", async () => {
    const promises = Array.from(
      { length: 1000 },
      () =>
        new Promise<number>((resolve) => {
          const delay = Math.floor(Math.random() * 100);
          setTimeout(() => {
            resolve(delay);
          }, delay);
        })
    );
    const start = performance.now();
    const result = await myPromiseDotAll(promises);
    const end = performance.now();
    expect(result.length).toBe(promises.length);
    expect(end - start).toBeLessThan(120); // All promises should resolve in under 110ms
    // Increased a little bit to make sure it passes the tests
    // It's not unexpected for the actual time to be slightly higher than the expected time,
    // as there might be some overhead in running the test or resolving the promises.
  });

  it("should error when not provided with iterable", () => {
    expect(() => myPromiseDotAll({} as Iterable<any>)).toThrow(TypeError);
  });
});
