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
            margin-bottom: 30px;
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

        #add-quote-btn,
        #random-quote-btn {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #3498db;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            margin-top: 5px;
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
        
        <div id="quote-form">
            <textarea id="quote-input" placeholder="Enter the quote..."></textarea>
            <input type="text" id="author-input" placeholder="Enter the author's name...">
            <input type="text" id="category-input" placeholder="Enter the quote category (e.g., Philosophy, Tech, Humor)">
            <button id="add-quote-btn">Add Quote</button>
            <button id="random-quote-btn">Show Random Quote</button>
        </div>

        <div id="random-quote-display">
            <p id="initial-random-text" class="no-quotes">Click 'Show Random Quote' to see a quote.</p>
        </div>
        <h2>Stored Quotes</h2>
        <div id="quotes-list">
            </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            
            // --- Define Variables ---
            const quoteInput = document.getElementById('quote-input');
            const authorInput = document.getElementById('author-input');
            const categoryInput = document.getElementById('category-input');
            const addQuoteBtn = document.getElementById('add-quote-btn');
            const randomQuoteBtn = document.getElementById('random-quote-btn');
            const quotesList = document.getElementById('quotes-list');
            const randomQuoteDisplay = document.getElementById('random-quote-display');
            
            const STORAGE_KEY = 'myFavoriteQuotes';

            // --- Helper Functions ---

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
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            }

            // --- Implement Display Function ---
            
            /**
             * Renders all stored quotes to the DOM.
             */
            function displayQuotes() {
                const quotes = getQuotesFromStorage();
                
                // Use clearChildren instead of element.innerHTML = ''
                clearChildren(quotesList); 

                if (quotes.length === 0) {
                    const noQuotesP = document.createElement('p');
                    noQuotesP.classList.add('no-quotes');
                    noQuotesP.textContent = 'No quotes stored yet.';
                    quotesList.appendChild(noQuotesP);
                    return;
                }

                // Iterate through quotes and create HTML for each
                quotes.forEach((quote, index) => {
                    const quoteItem = document.createElement('div');
                    quoteItem.classList.add('quote-item');
                    
                    const quoteText = document.createElement('p');
                    const cleanQuoteText = quote.text.replace(/^["']|["']$/g, '');
                    // Use textContent instead of innerHTML
                    quoteText.textContent = `"${cleanQuoteText}"`; 
                    
                    const quoteAuthor = document.createElement('cite');
                    // Use textContent instead of innerHTML
                    quoteAuthor.textContent = `- ${quote.author} (${quote.category || 'N/A'})`; 
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-btn');
                    removeBtn.textContent = '×';
                    removeBtn.dataset.index = index; 
                    
                    // Use append instead of multiple appendChild calls
                    quoteItem.append(quoteText, quoteAuthor, removeBtn);
                    
                    quotesList.appendChild(quoteItem);
                });
            }

            // --- Implement Add Quote Function ---

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

            // --- Implement Random Quote Function (RENAMED FUNCTION) ---

            /**
             * Selects a random quote from storage and displays it.
             */
            function displayRandomQuote() {
                const quotes = getQuotesFromStorage();
                
                // Use clearChildren instead of element.innerHTML = ''
                clearChildren(randomQuoteDisplay);
                
                if (quotes.length === 0) {
                    const noQuotesP = document.createElement('p');
                    noQuotesP.classList.add('no-quotes');
                    noQuotesP.textContent = 'Please add some quotes first!';
                    randomQuoteDisplay.appendChild(noQuotesP);
                    return;
                }
                
                // 1. Get a random index
                const randomIndex = Math.floor(Math.random() * quotes.length);
                const randomQuote = quotes[randomIndex];
                
                // 2. Prepare the display elements
                const cleanQuoteText = randomQuote.text.replace(/^["']|["']$/g, '');
                
                const quoteText = document.createElement('p');
                // Use textContent instead of innerHTML
                quoteText.textContent = `"${cleanQuoteText}"`;
                
                const quoteAuthor = document.createElement('cite');
                // Use textContent instead of innerHTML
                quoteAuthor.textContent = `- ${randomQuote.author} (${randomQuote.category || 'N/A'})`;
