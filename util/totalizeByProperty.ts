export function totalizeByProperty(array: any[], property: string) {
  return array.reduce((prev, current) => {
    if (current[property]) {
      return prev + current[property];
    }
    return prev;
  }, 0);
}