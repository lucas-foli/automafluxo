const str = "gasolina - 1,09 - nubank";

const regex2dec = /(?<price>\d+,\d{2})/;
const regexNoDec = /(?<price>\d)/;
const test = 'gasolina'
console.log(test.charAt(0).toUpperCase()+test.slice(1))
const match = str.match(regex2dec) ?? str.match(regexNoDec);
console.log(match)

if (match && match.groups?.price) {
  const payments = ["c6", "visa", "elo", "pix lucas", "pix juh"];
  const price = match.groups.price;
  const category = str
    .replace(price, "")
    .replace(/[-–—]/, "")
    .split(" ")[0]
    .trim();
  const paymentStr = str
    .replace(price, "")
    .replace(category, "")
    .replace(/[—–-]/g, "")
    .trim();
  const payment = payments.filter((pay) => paymentStr.includes(pay))[0] ?? null;
  console.log(`price is: ${price}`);
  console.log(`category is: ${category}`);
  console.log(`payment is: ${payment}`);
  const isNumber = Number.parseFloat(price.replace(",", "."));
  console.log(`isNumber is: ${isNumber}`);
} else {
  console.log("No match found.");
}
