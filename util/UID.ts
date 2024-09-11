const generateId = () => Math.round(Math.random() * (999999999999 - 999) + 999).toString(16);
let UUIDs: { [index: string]: boolean } = {};
export default function UID () {
  return {
    generate() {
      let newId: keyof typeof UUIDs;
      do {
        newId = generateId();
      } while (UUIDs[newId])
      UUIDs[newId] = true;
      return newId;
    }
  }
}