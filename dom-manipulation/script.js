// Load quotes from local storage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
];

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote)); // Save the last viewed quote to session storage
}

// Function to create and display the form to add a new quote
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes();
    alert('New quote added successfully!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const exportLink = document.createElement('a');
  exportLink.href = url;
  exportLink.download = 'quotes.json';
  document.body.appendChild(exportLink);
  exportLink.click();
  document.body.removeChild(exportLink);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initial call to display a quote when the page loads
showRandomQuote();

// Call to create and display the form for adding new quotes
createAddQuoteForm();

// Load the last viewed quote from session storage (if available)
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><p><em>${lastQuote.category}</em></p>`;
}

// Create and append export and import elements
const exportButton = document.createElement('button');
exportButton.textContent = 'Export Quotes';
exportButton.addEventListener('click', exportToJsonFile);
document.body.appendChild(exportButton);

const importInput = document.createElement('input');
importInput.type = 'file';
importInput.id = 'importFile';
importInput.accept = '.json';
importInput.onchange = importFromJsonFile;
document.body.appendChild(importInput);
