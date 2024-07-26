const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API for demonstration purposes

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

// Save selected category to local storage
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Load selected category from local storage
function loadSelectedCategory() {
  return localStorage.getItem('selectedCategory') || 'all';
}

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
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
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    saveQuotes();
    populateCategories(); // Update categories after adding a new quote

    // Post the new quote to the server
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuote),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('New quote added and posted to the server successfully!');
    } catch (error) {
      console.error('Error posting data to server:', error);
      alert('Error posting data to the server. Please try again.');
    }
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
    populateCategories(); // Update categories after importing new quotes
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = loadSelectedCategory(); // Set the selected category
}

// Function to get filtered quotes based on selected category
function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  if (selectedCategory === 'all') {
    return quotes;
  } else {
    return quotes.filter(quote => quote.category === selectedCategory);
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  saveSelectedCategory(selectedCategory);
  showRandomQuote();
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();
    resolveConflicts(serverQuotes); // Handle conflicts between local and server data
  } catch (error) {
    console.error('Error fetching data from server:', error);
  }
}

// Function to synchronize local quotes with the server
async function syncQuotes() {
  try {
    // Fetch current server quotes
    const response = await fetch(API_URL);
    const serverQuotes = await response.json();

    // Resolve conflicts and update local quotes
    resolveConflicts(serverQuotes);

    // Optionally, send local updates to the server
    for (const quote of quotes) {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
      });
    }

    alert('Quotes synchronized with the server successfully!');
  } catch (error) {
    console.error('Error synchronizing quotes with server:', error);
    alert('Error synchronizing quotes with the server. Please try again.');
  }
}

// Function to handle conflicts between local and server data
function resolveConflicts(serverQuotes) {
  // Example conflict resolution: server data takes precedence
  if (serverQuotes.length > 0) {
    quotes = serverQuotes; // Overwrite local quotes with server quotes
    saveQuotes(); // Save the resolved quotes to local storage
    populateCategories(); // Update category dropdown
    alert('Data updated from the server.');
  }
}

// Add event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initial call to display a quote and populate categories when the page loads
populateCategories();
showRandomQuote();

// Call to create and display the form for adding new quotes
createAddQuoteForm();

// Load the last viewed quote from session storage (if available)
const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
if (lastQuote) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><p><em>${lastQuote.category}</em></p>`;
}

// Start syncing with the server
syncQuotes();
