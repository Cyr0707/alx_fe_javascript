// --- Global Variables ---
let quoteInput, authorInput, categoryInput, addQuoteBtn, randomQuoteBtn, exportBtn, categoryFilter;
let appContainer, quotesList, quoteDisplay;
let syncBtn, syncStatus; // NEW: For server sync

const STORAGE_KEY = 'myFavoriteQuotes';
const SESSION_KEY = 'lastViewedQuote';
const FILTER_KEY = 'lastSelectedFilter'; 
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // NEW: Mock server URL

// --- Helper Functions (Global Scope) ---

function getQuotesFromStorage() {
    const quotesString = localStorage.getItem(STORAGE_KEY);
    return quotesString ? JSON.parse(quotesString) : [];
}

function saveQuotesToStorage(quotes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function clearChildren(element) {
    element.innerHTML = '';
}

// --- Display Functions (Global Scope) ---

function populateCategories() {
    const quotes = getQuotesFromStorage();
    const categories = new Set(quotes.map(quote => quote.category));
    
    const savedFilter = localStorage.getItem(FILTER_KEY) || 'all';

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = savedFilter;
}

function displayQuotes() {
    const quotes = getQuotesFromStorage();
    const selectedCategory = categoryFilter.value; 
    
    clearChildren(quotesList); 

    let quotesDisplayed = 0; 

    quotes.forEach((quote, originalIndex) => {
        if (selectedCategory === 'all' || quote.category === selectedCategory) {
            quotesDisplayed++; 
            
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
            removeBtn.dataset.index = originalIndex; 
            
            quoteItem.append(quoteText, quoteAuthor, removeBtn);
            quotesList.appendChild(quoteItem);
        }
    });

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

function displayInRandomArea(quote, isPlaceholder = false) {
     clearChildren(quoteDisplay); 
     
     const quoteText = document.createElement('p');
     const quoteAuthor = document.createElement('cite');
     
     if (isPlaceholder) {
         quoteText.textContent = quote.text;
         quoteText.classList.add('no-quotes');
         quoteDisplay.appendChild(quoteText); 
     } else {
        const cleanQuoteText = (quote.text || '').replace(/^["']|["']$/g, '');
        quoteText.textContent = `"${cleanQuoteText}"`;
        quoteAuthor.textContent = `- ${quote.author || 'Unknown'} (${quote.category || 'N/A'})`;
        quoteDisplay.append(quoteText, quoteAuthor); 
     }
}

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

function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.id = 'quote-form';

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

// MODIFIED: 'addQuote' is now async to handle server POST
async function addQuote() {
    const quoteText = quoteInput.value.trim();
    const authorText = authorInput.value.trim();
    const categoryText = categoryInput.value.trim();

    if (!quoteText || !authorText || !categoryText) {
        alert('Please fill in the quote, author, and category fields.');
        return;
    }

    const newQuote = {
        text: quoteText,
        author: authorText,
        category: categoryText 
    };
    
    try {
        // Push to server and get back the quote with a server ID
        const serverQuote = await pushQuoteToServer(newQuote);
        
        const quotes = getQuotesFromStorage();
        quotes.push(serverQuote);
        saveQuotesToStorage(quotes);
        
        quoteInput.value = '';
        authorInput.value = '';
        categoryInput.value = '';
        
        populateCategories(); 
        displayQuotes();
        updateSyncStatus('Quote saved and synced with server.');
    } catch (error) {
        console.error('Failed to post quote:', error);
        updateSyncStatus('Error: Quote saved locally but failed to sync.');
        // Still save locally even if server fails
        const quotes = getQuotesFromStorage();
        quotes.push(newQuote); // Save without server ID
        saveQuotesToStorage(quotes);
        populateCategories(); 
        displayQuotes();
    }
}

// MODIFIED: 'removeQuote' is now async to handle server DELETE
async function removeQuote(indexToRemove) {
    let quotes = getQuotesFromStorage();
    const quoteToRemove = quotes[indexToRemove];

    // If the quote has a server 'id', attempt to delete it from the server
    if (quoteToRemove && quoteToRemove.id) {
        try {
            await fetch(`${SERVER_URL}/${quoteToRemove.id}`, {
                method: 'DELETE',
            });
            updateSyncStatus(`Quote ${quoteToRemove.id} deleted from server.`);
        } catch (error) {
            console.error('Failed to delete quote from server:', error);
            updateSyncStatus('Error: Failed to delete quote from server.');
        }
    }

    // Remove from local storage regardless
    quotes = quotes.filter((_, index) => index !== indexToRemove);
    saveQuotesToStorage(quotes);
    
    populateCategories(); 
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

function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem(FILTER_KEY, selectedCategory);
    displayQuotes();
}

// --- Import / Export Functions ---

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
    if (!file) { return; }

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
            // Simple merge: add new, avoiding exact duplicates
            const currentQuotesSet = new Set(currentQuotes.map(q => JSON.stringify(q)));
            validQuotes.forEach(q => {
                if (!currentQuotesSet.has(JSON.stringify(q))) {
                    currentQuotes.push(q);
                }
            });

            saveQuotesToStorage(currentQuotes);
            populateCategories(); 
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

// --- NEW: Server Sync Functions ---

/**
 * Updates the sync status message in the UI.
 */
function updateSyncStatus(message, isError = false) {
    syncStatus.textContent = message;
    syncStatus.style.color = isError ? '#e74c3c' : '#777';
    
    // Clear the message after 4 seconds
    setTimeout(() => {
        syncStatus.textContent = '';
    }, 4000);
}

/**
 * Maps a post from JSONPlaceholder to our quote format.
 */
function mapServerQuote(post) {
    return {
        id: post.id, // Keep the server ID
        text: post.title,
        author: `User ${post.userId}`,
        category: 'Server' // Assign a default category
    };
}

/**
 * Pushes a new local quote to the server (simulated).
 * Returns the new quote with the server's ID.
 */
async function pushQuoteToServer(quote) {
    const response = await fetch(SERVER_URL, {
        method: 'POST',
        body: JSON.stringify({
            title: quote.text,
            body: quote.text, // JSONPlaceholder needs a 'body'
            userId: 1 // Mock user ID
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });

    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }

    const serverPost = await response.json();
    
    // Return our quote format, but with the new ID from the server
    return {
        id: serverPost.id,
        text: quote.text,
        author: quote.author,
        category: quote.category
    };
}

/**
 * Fetches server data and merges it with local data.
 */
async function syncData() {
    updateSyncStatus('Syncing with server...');
    try {
        // 1. Fetch "base" quotes from the server
        const response = await fetch(`${SERVER_URL}?_limit=10`); // Get 10 base quotes
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const serverPosts = await response.json();
        const serverBaseQuotes = serverPosts.map(mapServerQuote);

        // 2. Get all local quotes
        const localQuotes = getQuotesFromStorage();

        // 3. Find quotes that are *only* local (ours that we added)
        // We assume serverBaseQuotes are IDs 1-10
        const localOnlyQuotes = localQuotes.filter(lq => {
            // Check if this local quote's ID is in the base server set
            return !serverBaseQuotes.some(sq => sq.id === lq.id);
        });

        // 4. Merge: Server data takes precedence, but we keep our added quotes
        const mergedQuotes = [...serverBaseQuotes, ...localOnlyQuotes];
        
        // Sort by ID to maintain a consistent order
        mergedQuotes.sort((a, b) => (a.id || 0) - (b.id || 0));
        
        // 5. Check if a sync is actually needed
        if (JSON.stringify(mergedQuotes) !== JSON.stringify(localQuotes)) {
            saveQuotesToStorage(mergedQuotes);
            populateCategories();
            displayQuotes();
            updateSyncStatus('Sync complete. Data merged from server.');
        } else {
            updateSyncStatus('Sync complete. Already up-to-date.');
        }

    } catch (error) {
        console.error('Sync failed:', error);
        updateSyncStatus('Sync failed. Could not connect to server.', true);
    }
}


// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Assign global DOM element variables
    appContainer = document.getElementById('app-container');
    quotesList = document.getElementById('quotes-list');
    quoteDisplay = document.getElementById('random-quote-display'); 
    exportBtn = document.getElementById('export-btn');
    categoryFilter = document.getElementById('categoryFilter'); 
    syncBtn = document.getElementById('sync-btn'); // NEW
    syncStatus = document.getElementById('sync-status'); // NEW
    
    // 2. Create the form
    createAddQuoteForm();

    // 3. Add Event Listeners
    addQuoteBtn.addEventListener('click', addQuote);
    randomQuoteBtn.addEventListener('click', showRandomQuote); 
    exportBtn.addEventListener('click', exportQuotes); 
    syncBtn.addEventListener('click', syncData); // NEW

    quotesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = parseInt(event.target.dataset.index, 10);
            removeQuote(index);
        }
    });

    // 4. Initial Display & Sync
    loadLastViewedQuote();
    populateCategories(); 
    displayQuotes();
    
    // 5. Initial sync on load and set up periodic sync
    syncData(); // Sync once on load
    setInterval(syncData, 60000); // Sync every 60 seconds
    
});
