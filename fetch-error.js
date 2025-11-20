async function main() {
  try {
    const res = await fetch('http://localhost:3000/api/properties?limit=50&sortBy=rating');
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (e) {
    console.error(e);
  }
}
main();
