export const rnd = (() => {
  const gen = (min: number, max: number) =>
    (max++ && [...Array(max - min)].map((s, i) => String.fromCharCode(min + i))) || [''];

  const sets = {
    num: gen(48, 57),
    alphaLower: gen(97, 122),
    alphaUpper: gen(65, 90),
    special: [...`~!@#$%^&*()_+-=[]\\{}|;:'",./<>?`],
  };

  function* iter(len: number, set: ReturnType<typeof gen>) {
    let validatedSet = [...set];
    if (set.length < 1) validatedSet = Object.values(sets).flat();
    for (let i = 0; i < len; i++) yield validatedSet[(Math.random() * validatedSet.length) | 0];
  }

  return Object.assign(
    (len: number, ...set: typeof sets[keyof typeof sets][]) => [...iter(len, set.flat())].join(''),
    sets
  );
})();
