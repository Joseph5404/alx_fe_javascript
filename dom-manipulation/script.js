// Array to store quotes
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  // Add event listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initial call to display a quote when the page loads
  showRandomQuote();
  