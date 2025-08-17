const button = document.getElementById("newQuote");
const syncButton = document.getElementById("syncQuotes");
const quoteGenerator = document.querySelector("h1");
const newQuote = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const newQuoteButton = document.getElementById("addQuote");
const notification = document.getElementById("notification");

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
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
    populateCategories();
    filterQuotes();
  }
}
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty format
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

document
  .getElementById("export-quotes")
  .addEventListener("click", exportToJsonFile);

newQuoteButton.addEventListener("click", createAddQuoteForm);
button.addEventListener("click", () => showRandomQuote(""));
const saved = localStorage.getItem("quotes");
if (saved) {
  const parsed = JSON.parse(saved);
  quotes.length = 0; // clear default ones
  quotes.push(...parsed); // load from storage
}
function importFromJsonFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = quotes.concat(importedQuotes);
        displayQuotes();
      } else {
        alert("Invalid file format");
      }
    } catch {
      alert("Error reading file");
    }
  };
  reader.readAsText(file);
}

document.getElementById("import-btn").onclick = () => {
  const fileInput = document.getElementById("import-file");
  if (fileInput.files.length > 0) {
    importFromJsonFile(fileInput.files[0]);
  } else {
    alert("Please select a file first");
  }
};

function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });

  // restore last filter from localStorage
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    filter.value = savedFilter;
    filterQuotes();
  }
}
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const listDiv = document.getElementById("quote-list");
  listDiv.innerHTML = "";

  quotes
    .filter((q) => selected === "all" || q.category === selected)
    .forEach((q) => {
      const p = document.createElement("p");
      p.textContent = `"${q.text}" — ${q.category}`;
      listDiv.appendChild(p);
    });
}
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Sync quotes function
async function syncQuotes() {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  try {
    // Send local quotes to server
    for (const quote of localQuotes) {
      if (!quote.synced) {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quote),
        });
        quote.synced = true;
      }
    }

    // Save updated local storage
    localStorage.setItem("quotes", JSON.stringify(localQuotes));

    // Fetch latest quotes from server (mocked)
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();

    // Conflict resolution (simple: prefer local if duplicate id)
    const merged = [...serverQuotes];
    localQuotes.forEach((lq) => {
      if (!merged.find((sq) => sq.id === lq.id)) {
        merged.push(lq);
      }
    });

    // Save merged data
    localStorage.setItem("quotes", JSON.stringify(merged));

    // Show UI notification
    showNotification("Quotes synced successfully ✅");
  } catch (error) {
    showNotification("Sync failed ❌");
    console.error("Sync error:", error);
  }
}

// Periodically sync every 30 seconds
setInterval(syncQuotes, 30000);

// Small UI notification
function showNotification(message) {
  let notif = document.getElementById("sync-notification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "sync-notification";
    notif.style.position = "fixed";
    notif.style.bottom = "10px";
    notif.style.right = "10px";
    notif.style.background = "#333";
    notif.style.color = "#fff";
    notif.style.padding = "8px 12px";
    notif.style.borderRadius = "5px";
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  setTimeout(() => notif.remove(), 4000);
}
function fetchQuotesFromServer() {
  // Example: fetching from a local quotes.json file
  fetch("quotes.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch quotes from server");
      }
      return response.json();
    })
    .then((data) => {
      // Add quotes to your app's quotes array
      quotes = data;
      alert("Quotes fetched from server successfully!");
      displayRandomQuote(); // optional: show one after fetching
    })
    .catch((error) => {
      console.error("Error fetching quotes:", error);
      alert("Could not fetch quotes from server.");
    });
}
function showPopupMessage(message) {
  // Create popup container
  const popup = document.createElement("div");
  popup.innerText = message;

  // Style the popup
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.padding = "12px 20px";
  popup.style.backgroundColor = "#333";
  popup.style.color = "#fff";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
  popup.style.zIndex = "1000";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s ease";

  // Add popup to body
  document.body.appendChild(popup);

  // Fade in
  requestAnimationFrame(() => {
    popup.style.opacity = "1";
  });

  // Auto-remove after 3 seconds
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.remove();
    }, 300);
  }, 3000);
}

// Example usage
showPopupMessage("Quotes synced with server!");
document
  .getElementById("fetch-quotes-btn")
  .addEventListener("click", fetchQuotesFromServer);

setInterval(syncQuotes, 30000);
populateCategories();
filterQuotes();
