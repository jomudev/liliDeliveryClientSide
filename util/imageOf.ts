export default async function imageOf(query: string) {
  let image;
  let response = await fetch(`https://api.unsplash.com/search/photos?client_id=u-iqrEAV5ZJdNCGRb6gSQCs9Bv0mnpXS71gTo65HZcU&query=${query}&orientation=squarish&per_page=1&page=1`);
  response = await response.json();
  image = response.results[0].urls.small;
  console.log(JSON.stringify(image, null, 4));
  return image;
};