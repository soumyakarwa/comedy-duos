import requests
from bs4 import BeautifulSoup
import pandas as pd

# Load the CSV file
file_path = './brooklyn-nine-nine.csv'  # Update with the correct path to your CSV file
df = pd.read_csv(file_path)

# Function to scrape the episode description
def scrape_episode_description(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        possible_ids = [
            "Episode_Synopsis",
            "Episodes_Synopsis",
            "Episode_Synopses",
            "Episode_Description",
            "Episode_synopsis"
        ]
        episode_synopsis = None
        for pid in possible_ids:
            episode_synopsis = soup.find(id=pid)
            if episode_synopsis:
                break
        
        if episode_synopsis:
            combined_text = []
            for sibling in episode_synopsis.parent.find_next_siblings():
                count = 0; 
                if sibling.name == "h2":
                    break
                if sibling.name == "p":
                    count+=1
                    combined_text.append(sibling.text)
                print(count)
            return " ".join(combined_text)
        else:
            print(f"Synopsis not found for URL: {url}")
    else:
        print(f"Failed to retrieve URL: {url}")
    return "Description not found"

# Scrape descriptions for all episodes
base_url = "https://brooklyn99.fandom.com/wiki/"
titles = df['Title']

# Update title formatting to match URL encoding
titles = titles.apply(lambda x: x.replace(" ", "_").replace("&", "_%26_"))

detailed_descriptions = [scrape_episode_description(base_url + title) for title in titles]

# Add the new column to the DataFrame
df['Wiki Fandom Descriptions'] = pd.Series(detailed_descriptions)

# Save the updated DataFrame to a new CSV file
updated_file_path = './brooklyn_99_episodes_updated.csv'  # Update with your desired output path
df.to_csv(updated_file_path, index=False)

print("Updated CSV file saved to:", updated_file_path)
