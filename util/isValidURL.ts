export default function isValidURL(url: string) {
  try {
    if (!url.startsWith('http') || !url.startsWith('https')) return false;
    const newURL = new URL(url);
    console.log(JSON.stringify({
      url,
      formattedURL: newURL,
      protocol: newURL.protocol,
      startWithHttp: url.startsWith('http') || url.startsWith('https'),
    }, null, 4));
    return newURL.protocol == 'http:' || newURL.protocol == "https:";
  } catch(e) {
    return false;
  }
}