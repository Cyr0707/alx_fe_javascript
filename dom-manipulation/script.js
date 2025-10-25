// --- Global Variables ---
let quoteInput, authorInput, categoryInput, addQuoteBtn, randomQuoteBtn, exportBtn, categoryFilter;
let appContainer, quotesList, randomQuoteDisplay;

const STORAGE_KEY = 'myFavoriteQuotes';
const SESSION_KEY = 'lastViewedQuote';
const FILTER_KEY = 'lastSelectedFilter'; // NEW: Key for saving the filter

// --- Helper Functions (Global Scope) ---

/**
 * Gets all quotes from local storage and parses them.
 * @returns {Array} An array of quote objects.
 */
function getQuotesFromStorage() {
    const quotesString = localStorage.getItem(STORAGE_KEY);
    return quotesString ? JSON.parse(quotesString) : [];
}

/**
 * Saves the provided array of quotes to local storage.
 * @param {Array} quotes - The array of quote objects to save.
 */
function saveQuotesToStorage(quotes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

/**
 * Clears all children from a DOM element.
 * @param {Element} element - The parent element to clear.
 */
function clearChildren(element) {
    element.innerHTML = '';
}

// --- Display Functions (Global Scope) ---

/**
 * NEW: Populates the category filter dropdown with unique categories.
 */
function populateCategories() {
    const quotes = getQuotesFromStorage();
    // Use a Set to get only unique category names
    const categories = new Set(quotes.map(quote => quote.category));
    
    // Get the last saved filter from local storage
    const savedFilter = localStorage.getItem(FILTER_KEY) || 'all';

    // Clear existing options (but leave "All Categories")
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Set the dropdown to the last saved filter
    categoryFilter.value = savedFilter;
}

/**
 * Renders stored quotes to the DOM, applying the selected category filter.
 */
function displayQuotes() {
    const quotes = getQuotesFromStorage();
    // Get the currently selected filter value
    const selectedCategory = categoryFilter.value; 
    
    clearChildren(quotesList); 

    let quotesDisplayed = 0; // Counter for displayed quotes

    // Loop through all quotes, but only display ones that match the filter
    quotes.forEach((quote, originalIndex) => {
        if (selectedCategory === 'all' || quote.category === selectedCategory) {
            quotesDisplayed++; // Increment counter
            
            const quoteItem = document.createElement('div');
            quoteItem.classList.add('quote-item');
            
            const quoteText = document.createElement('p');
            const cleanQuoteText = (quote.text || '').replace(/^["']|["']$/g, '');
            quoteText.textContent = `"${cleanQuoteText}"`; 
            
            const quoteAuthor = document.createElement('cite');
            quoteAuthor.textContent = `- ${quote.author || 'Unknown'} (${quote.category || 'N/A'})`; 
            
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = '×';
            // IMPORTANT: Use the originalIndex so remove works correctly
            removeBtn.dataset.index = originalIndex; 
            
            quoteItem.append(quoteText, quoteAuthor, removeBtn);
            quotesList.appendChild(quoteItem);
        }
    });

    // If no quotes were displayed, show a relevant message
    if (quotesDisplayed === 0) {
        const noQuotesP = document.createElement('p');
        noQuotesP.classList.add('no-quotes');
        if (selectedCategory === 'all') {
            noQuotesP.textContent = 'No quotes stored yet.';
        } else {
            noQuotesP.textContent = `No quotes found in the "${selectedCategory}" category.`;
        }
        quotesList.appendChild(noQuotesP);
    }
}

/**
 * Creates and displays a quote in the random display area.
 * @param {Object} quote - The quote object {text, author, category}
 * @param {boolean} [isPlaceholder=false] - If true, style as a placeholder.
 */
function displayInRandomArea(quote, isPlaceholder = false) {
     clearChildren(randomQuoteDisplay);
     
     const quoteText = document.createElement('p');
     const quoteAuthor = document.createElement('cite');
     
     if (isPlaceholder) {
         quoteText.textContent = quote.text;
         quoteText.classList.add('no-quotes');
         randomQuoteDisplay.appendChild(quoteText);
     } else {
        const cleanQuoteText = (quote.text || '').replace(/^["']|["']$/g, '');
        quoteText.textContent = `"${cleanQuoteText}"`;
        quoteAuthor.textContent = `- ${quote.author || 'Unknown'} (${quote.category || 'N/A'})`;
        randomQuoteDisplay.append(quoteText, quoteAuthor);
     }
}

/**
 * Loads the last viewed quote from session storage.
 */
function loadLastViewedQuote() {
    const lastQuoteString = sessionStorage.getItem(SESSION_KEY);
    if (lastQuoteString) {
        const lastQuote = JSON.parse(lastQuoteString);
        displayInRandomArea(lastQuote);
    } else {
        displayInRandomArea({ text: "Click 'Show Random Quote' to see a quote." }, true);
    }
}

// --- Core App Logic (Global Scope) ---

/**
 * Creates the quote input form and appends it to the container.
 */
function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.id = 'quote-form';

    // Create and assign global variables
    quoteInput = document.createElement('textarea');
    quoteInput.id = 'quote-input';
    quoteInput.placeholder = 'Enter the quote...';

    authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.id = 'author-input';
    authorInput.placeholder = "Enter the author's name...";

    categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'category-input';
    categoryInput.placeholder = 'Enter the quote category (e.g., Philosophy, Tech, Humor)';

    addQuoteBtn = document.createElement('button');
    addQuoteBtn.id = 'add-quote-btn';
    addQuoteBtn.className = 'btn';
    addQuoteBtn.textContent = 'Add Quote';
    
    randomQuoteBtn = document.createElement('button');
    randomQuoteBtn.id = 'random-quote-btn';
    randomQuoteBtn.className = 'btn';
    randomQuoteBtn.textContent = 'Show Random Quote';

    formDiv.append(quoteInput, authorInput, categoryInput, addQuoteBtn, randomQuoteBtn);
    
    const dataManagementDiv = document.getElementById('data-management');
    appContainer.insertBefore(formDiv, dataManagementDiv);
}

function addQuote() {
    const quoteText = quoteInput.value.trim();
    const authorText = authorInput.value.trim();
    const categoryText = categoryInput.value.trim();

    if (quoteText && authorText && categoryText) {
        const newQuote = {
            text: quoteText,
            author: authorText,
            category: categoryText 
        };
        
        const quotes = getQuotesFromStorage();
        quotes.push(newQuote);
        saveQuotesToStorage(quotes);
        
        quoteInput.value = '';
        authorInput.value = '';
        categoryInput.value = '';
        
        populateCategories(); // UPDATE: Refresh category dropdown
        displayQuotes();
    } else {
        alert('Please fill in the quote, author, and category fields.');
    }
}

function removeQuote(indexToRemove) {
    let quotes = getQuotesFromStorage();
    quotes = quotes.filter((_, index) => index !== indexToRemove);
    saveQuotesToStorage(quotes);
    
    populateCategories(); // UPDATE: Refresh category dropdown
    displayQuotes();
}

function showRandomQuote() {
    const quotes = getQuotesFromStorage();
    
    if (quotes.length === 0) {
        displayInRandomArea({ text: 'Please add some quotes first!' }, true);
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    displayInRandomArea(randomQuote);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(randomQuote));
}

/**
 * NEW: Saves the selected filter and redisplays the quotes.
 * This is called by the onchange attribute in the HTML.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem(FILTER_KEY, selectedCategory);
    displayQuotes();
}

// --- Import / Export Functions (Global Scope) ---

function exportQuotes() {
    const quotes = getQuotesFromStorage();
    const dataStr = JSON.stringify(quotes, null, 2); 
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.download = 'my_quotes.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return; 
    }

    const fileReader = new FileReader();
    
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (!Array.isArray(importedQuotes)) {
                alert('Import failed: JSON file does not contain a quote array.');
                return;
            }

            const validQuotes = importedQuotes.filter(q => q.text && q.author);
            if (validQuotes.length === 0) {
                 alert('Import failed: No valid quotes found in the file.');
                 return;
            }
            
            const currentQuotes = getQuotesFromStorage();
            const allQuotes = currentQuotes.concat(validQuotes);
            
            saveQuotesToStorage(allQuotes);
            
            populateCategories(); // UPDATE: Refresh category dropdown
            displayQuotes();
            
            alert(`Imported ${validQuotes.length} quotes successfully!`);

        } catch (error) {
            console.error('Error parsing JSON file:', error);
            alert('Import failed: Could not read or parse the file.');
        }
    };
    
    fileReader.readAsText(file);
    event.target.value = null;
}


// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Assign global DOM element variables
    appContainer = document.getElementById('app-container');
    quotesList = document.getElementById('quotes-list');
    randomQuoteDisplay = document.getElementById('random-quote-display');
    exportBtn = document.getElementById('export-btn');
    categoryFilter = document.getElementById('categoryFilter'); // NEW
    
    // 2. Create the form
    createAddQuoteForm();

    // 3. Add Event Listeners
    addQuoteBtn.addEventListener('click', addQuote);
    randomQuoteBtn.addEventListener('click', showRandomQuote); 
    exportBtn.addEventListener('click', exportQuotes); 

    quotesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            removeQuote(index);
        }
    });

    // 4. Initial Display
    loadLastViewedQuote();
    populateCategories(); // NEW: Populate dropdown and set saved filter
    displayQuotes(); // NEW: Will now display with the saved filter
    
});
