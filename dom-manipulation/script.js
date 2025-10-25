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
            padding
