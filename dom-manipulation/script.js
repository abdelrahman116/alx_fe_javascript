const button = document.getElementById("newQuote");
const quoteGenerator = document.querySelector("h1");
const quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivation",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: "Inspiration",
  },
  {
    text: "Life is what happens when you’re busy making other plans.",
    category: "Life",
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation",
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    category: "Wisdom",
  },
];
function showRandomQuote(category) {
  if (category != "") {
    quotes.forEach((quote) => {
      if (quote.category === category) {
        quoteGenerator.innerHTML = quote.text;
        console.log(quote.text);
      }
    });
  } else {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteGenerator.innerHTML = quotes[randomIndex].text;
  }
}
button.addEventListener("click", () => showRandomQuote(""));
