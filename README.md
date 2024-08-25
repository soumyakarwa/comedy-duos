COMEDY-DUOS

The Most Iconic Duo Of Brooklyn Nine-Nine
This GitHub repository hosts the front-end and data analysis code for a data-driven visual essay project titled "The Most Iconic Duo of Brooklyn Nine-Nine." The project involves analyzing episode descriptions to identify character pairings and correlating this data with IMDb episode ratings and votes. The goal is to determine which character duo is the most beloved in the show.

Original Dataset: https://www.kaggle.com/datasets/bcruise/brooklyn-99-episode-data

---

SUB DIRECTORIES

--- shared
All files in this folder are written by Professor Justin Bakse. I was part of a class at Parsons called "Javascript + OpenAI" during Spring 2024, which Prof. Bakse taught. He provided us these files to build programs using the OpenAI API. I use these files to call the OpenAI API in data-analysis

--- data-prep

Data-Prep has three sub-directories: Scraping, Cleaning and Analysis.

Scraping
In addition to the original kaggle dataset (with IMdB ratings, votes and other episode information), I wrote two scripts to scrape additinonal episode information from Wikipedia and WikiFandom. These were usually longer, more detailed than the original descriptions and assisted with my analysis

Cleaning & Analysis
Cleaning & Analysis go hand in hand. I started with using NLTK to identify sentences and then cleaning the sentences. Next, I used the API to further break down complicated sentences into clauses and clean up those clauses. Then I identified pairs or groups of characters, cleaned those up by removing duplicates.

--- data-analysis
Data-Analysis is more for internal use. I wrote mostIconicDuo.py to test different analyses like calculating cummulative average rating or votes etc.

--- frontend/svelte-app
This contains all frontend code. I used D3.js and Svelte.js.
App: Parent component
Content: Contains all functionality
LandingPage: Landing component
Standalone: Reusable component for standalone texts like the Introduction
Characters/CharactersMobile: Characters introduction
Episode Breakdown: Section explaining how each episode was analysed
HeatMap: Section with heatmap for all episodes

--- SOURCES
All gifs from https://tenor.com/view/brooklyn-nine-nine-charles-boyle-tell-me-everything-tell-me-joe-lo-truglio-gif-19356569

Images: Google, Pinterest
