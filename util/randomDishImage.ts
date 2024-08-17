export async function randomDishImageURL () {
  const { image: randomDishURL } = await (await fetch("https://foodish-api.com/api")).json();
  return randomDishURL;
};