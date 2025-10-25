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
        }

        #quote-input,
        #author-input,
        #category-input { /* Added category-input here */
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box; /* Important for padding to work with 100% width */
        }

        #quote-input {
            min-height: 80px;
            resize: vertical;
        }

        #add-quote-btn {
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #3498db;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        #add-quote-btn:hover {
            background-color: #2980b9;
        }

        /* Quotes List Styling */
        #quotes-list {
            margin-top: 20px;
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
            font-size: 0.9em; /* Make citation slightly smaller */
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
            const categoryInput = document.getElementById('category-input'); // NEW VARIABLE
            const addQuoteBtn = document.getElementById('add-quote-btn');
            const quotesList = document.getElementById('quotes-list');
            
            // Use a single, consistent key for local storage
            const STORAGE_KEY = 'myFavoriteQuotes';

            // --- Helper Functions ---

            /**
             * Gets all quotes from local storage and parses them.
             * @returns {Array} An array of quote objects.
             */
            function getQuotesFromStorage() {
                const quotesString = localStorage.getItem(STORAGE_KEY);
                // If no quotes are stored, return an empty array
                return quotesString ? JSON.parse(quotesString) : [];
            }

            /**
             * Saves the provided array of quotes to local storage.
             * @param {Array} quotes - The array of quote objects to save.
             */
            function saveQuotesToStorage(quotes) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
            }

            // --- Implement Display Function ---
            
            /**
             * Renders all stored quotes to the DOM.
             */
            function displayQuotes() {
                const quotes = getQuotesFromStorage();
                
                // Clear the current list to avoid duplicates
                quotesList.innerHTML = ''; 

                if (quotes.length === 0) {
                    quotesList.innerHTML = '<p class="no-quotes">No quotes stored yet.</p>';
                    return;
                }

                // Iterate through quotes and create HTML for each
                quotes.forEach((quote, index) => {
                    // Create the main container div
                    const quoteItem = document.createElement('div');
                    quoteItem.classList.add('quote-item');
                    
                    // Create the quote text paragraph
                    const quoteText = document.createElement('p');
                    const cleanQuoteText = quote.text.replace(/^["']|["']$/g, '');
                    quoteText.textContent = `"${cleanQuoteText}"`; 
                    
                    // Create the author citation (UPDATED TO INCLUDE CATEGORY)
                    const quoteAuthor
