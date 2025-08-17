const button = document.getElementById("newQuote");
const quoteGenerator = document.querySelector("h1");
const newQuote = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const newQuoteButton = document.getElementById("addQuote");
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
  quoteDisplay.innerHTML = "";
  if (category != "") {
    quotes.forEach((quote) => {
      if (quote.category === category) {
        quoteGenerator.innerHTML = quote.text;
        console.log(quote.text);
      }
    });
  } else {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteGenerator.innerHTML = quotes[randomIndex].text;
    const p = document.createElement("p");
    p.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;

    // append
    quoteDisplay.appendChild(p);
  }
}
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function createAddQuoteForm() {
  const newText = newQuote.value.trim();
  const newCategory = newQuoteCategory.value.trim();

  if (newText && newCategory) {
    // add to array
    const newObj = { text: newText, category: newCategory };
    quotes.push(newObj);

    // create <p>
    const p = document.createElement("p");
    p.textContent = `"${newObj.text}" — ${newObj.category}`;

    // append
    quoteDisplay.appendChild(p);

    // clear inputs
    newQuote.value = "";
    newQuoteCategory.value = "";
    saveQuotes();
  }
}

newQuoteButton.addEventListener("click", createAddQuoteForm);
button.addEventListener("click", () => showRandomQuote(""));
const saved = localStorage.getItem("quotes");
if (saved) {
  const parsed = JSON.parse(saved);
  quotes.length = 0; // clear default ones
  quotes.push(...parsed); // load from storage
}
