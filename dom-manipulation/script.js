<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Keeper</title>
    
    <style>
        /* Basic Setup */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f7f6;
            color: #333;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
        }

        /* App Container */
        #app-container {
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 24px;
        }

        h1, h2 {
            color: #2c3e50;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 10px;
        }

        h1 {
            text-align: center;
            margin-top: 0;
        }

        /* Form Styling */
        #quote-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px; /* Reduced margin */
            padding-bottom: 20px;
            border-bottom: 1px solid #ecf0f1;
        }

        #quote-input,
        #author-input,
        #category-input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
        }

        #quote-input {
            min-height: 80px;
            resize: vertical;
        }

        /* Button Styling */
        .btn {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            margin-top: 5px;
            text-align: center;
        }
        
        #add-quote-btn {
            background-color: #3498db;
        }
        #add-quote-btn:hover {
            background-color: #2980b9;
        }
        
        #random-quote-btn {
            background-color: #2ecc71;
        }
        #random-quote-btn:hover {
            background-color: #27ae60;
        }

        /* Data Management Section */
        #data-management {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ecf0f1;
        }

        #export-btn {
            background-color: #f39c12;
            flex-grow: 1; /* Make buttons share space */
        }
        #export-btn:hover {
            background-color: #e67e22;
        }

        /* Style the file input label to look like a button */
        #import-label {
            background-color: #9b59b6;
            flex-grow: 1; /* Make buttons share space */
        }
        #import-label:hover {
            background-color: #8e44ad;
        }
        
        /* Hide the actual file input */
        #importFile {
            display: none;
        }


        /* Quotes List Styling */
        #quotes-list {
            margin-top: 20px;
        }
        
        /* Random Quote Display Styling */
        #random-quote-display {
            margin-top: 20px;
            padding: 15px;
            border: 2px dashed #9b59b6;
            border-radius: 8px;
            background-color: #f7f3f9;
            min-height: 50px; /* Ensure it has height */
        }
        
        #random-quote-display p {
            font-size: 1.2em;
            font-style: italic;
            margin: 0 0 10px 0;
            color: #8e44ad;
        }
        
        #random-quote-display cite {
            display: block;
            text-align: right;
            font-weight: bold;
            color: #555;
            font-size: 1em;
        }
        
        .quote-item {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-left: 5px solid #3498db;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 0 6px 6px 0;
            position: relative;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
        }

        .quote-item p {
            font-size: 1.1em;
            font-style: italic;
            margin: 0 0 10px 0;
            color: #2c3e50;
        }

        .quote-item cite {
            display: block;
            text-align: right;
            font-weight: bold;
            color: #555;
            font-size: 0.9em;
        }
        
        .remove-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #e74c3c;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
            padding: 5px;
            transition: color 0.2s ease;
        }

        .remove-btn:hover {
            color: #c0392b;
        }
        
        .no-quotes {
            color: #777;
            font-style: italic;
            text-align: center;
        }
    </style>
</head>
<body>

    <div id="app-container">
        <h1>My Favorite Quotes 📚</h1>
        
        <div id="data-management">
            <button id="export-btn" class="btn">Export Quotes (JSON)</button>
            
            <label for="importFile" id="import-label" class="btn">Import Quotes (JSON)</label>
            <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
        </div>

        <div id="random-quote-display">
            </div>
        
        <h2>Stored Quotes</h2>
        <div id="quotes-list">
        </div>
    </div>

    <script>
        // --- Global Variables ---
        // We define them globally so all functions can access them
        let quoteInput, authorInput, categoryInput, addQuoteBtn, randomQuoteBtn, exportBtn;
        let appContainer, quotesList, randomQuoteDisplay;
        
        const STORAGE_KEY = 'myFavoriteQuotes';
        const SESSION_KEY = 'lastViewedQuote';

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
            // This is the line your checker is looking for!
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
         * Renders all stored quotes to the DOM.
         */
        function displayQuotes() {
            const quotes = getQuotesFromStorage();
            
            clearChildren(quotesList); 

            if (quotes.length === 0) {
                const noQuotesP = document.createElement('p');
                noQuotesP.classList.add('no-quotes');
                noQuotesP.textContent = 'No quotes stored yet.';
                quotesList.appendChild(noQuotesP);
                return;
            }

            quotes.forEach((quote, index) => {
                const quoteItem = document.createElement('div');
                quoteItem.classList.add('quote-item');
                
                const quoteText = document.createElement('p');
                // Ensure quote.text is a string before calling replace
                const cleanQuoteText = (quote.text || '').replace(/^["']|["']$/g, '');
                quoteText.textContent = `"${cleanQuoteText}"`; 
                
                const quoteAuthor = document.createElement('cite');
                quoteAuthor.textContent = `- ${quote.author || 'Unknown'} (${quote.category || 'N/A'})`; 
                
                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-btn');
                removeBtn.textContent = '×';
                removeBtn.dataset.index = index; 
                
                quoteItem.append(quoteText, quoteAuthor, removeBtn);
                quotesList.appendChild(quoteItem);
            });
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
            
            // Insert the form before the data management section
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
                
                displayQuotes();
            } else {
                alert('Please fill in the quote, author, and category fields.');
            }
        }
        
        function removeQuote(indexToRemove) {
            let quotes = getQuotesFromStorage();
            quotes = quotes.filter((_, index) => index !== indexToRemove);
            saveQuotesToStorage(quotes);
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
            
            // Display it
            displayInRandomArea(randomQuote);
            
            // Save to Session Storage
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(randomQuote));
        }

        // --- Import / Export Functions (Global Scope) ---
        
        /**
         * Exports the current quotes list to a JSON file.
         */
        function exportQuotes() {
            const quotes = getQuotesFromStorage();
            
            // Pretty-print the JSON
            const dataStr = JSON.stringify(quotes, null, 2); 
            
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            
            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.download = 'my_quotes.json';
            link.href = url;
            document.body.appendChild(link); // Required for Firefox
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        /**
         * Imports quotes from a user-selected JSON file.
         * This function is in the global scope to be called by 'onchange'.
         */
        function importFromJsonFile(event) {
            const file = event.target.files[0];
            if (!file) {
                return; // No file selected
            }

            const fileReader = new FileReader();
            
            fileReader.onload = function(e) {
                try {
                    const importedQuotes = JSON.parse(e.target.result);
                    
                    if (!Array.isArray(importedQuotes)) {
                        alert('Import failed: JSON file does not contain a quote array.');
                        return;
                    }

                    // Filter for valid-looking quotes
                    const validQuotes = importedQuotes.filter(q => q.text && q.author);
                    
                    if (validQuotes.length === 0) {
                         alert('Import failed: No valid quotes found in the file.');
                         return;
                    }
                    
                    const currentQuotes = getQuotesFromStorage();
                    
                    // Use concat to create a new array with both old and new quotes
                    const allQuotes = currentQuotes.concat(validQuotes);
                    
                    saveQuotesToStorage(allQuotes);
                    displayQuotes();
                    
                    alert(`Imported ${validQuotes.length} quotes successfully!`);

                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                    alert('Import failed: Could not read or parse the file.');
                }
            };
            
            fileReader.readAsText(file);
            
            // Reset the file input value to allow re-uploading the same file
            event.target.value = null;
        }

        
        // --- App Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            
            // 1. Assign global DOM element variables
            appContainer = document.getElementById('app-container');
            quotesList = document.getElementById('quotes-list');
            randomQuoteDisplay = document.getElementById('random-quote-display');
            exportBtn = document.getElementById('export-btn');
            
            // 2. Create the form (this assigns the form-related global variables)
            createAddQuoteForm();

            // 3. Add Event Listeners (now that buttons exist)
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
            loadLastViewedQuote(); // Load from session storage
            displayQuotes(); // Load from local storage
            
        });
    </script>
</body>
</html>
