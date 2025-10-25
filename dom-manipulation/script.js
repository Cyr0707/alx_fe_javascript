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
            padding-bottom: 20px; /* Add space below form */
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
        #random-quote-btn { /* Style for both buttons */
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
            background-color: #2ecc71; /* A different color for the random button */
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
            <input type="text
