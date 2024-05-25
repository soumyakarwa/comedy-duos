import requests
from bs4 import BeautifulSoup
import pandas as pd

# Load the CSV file
file_path = 'brooklyn_99_episodes_updated.csv'
episodes_df = pd.read_csv(file_path)

# Define base URL and number of episodes in each season
base_url = 'https://en.wikipedia.org/wiki/Brooklyn_Nine-Nine_season_'
seasons = sorted(episodes_df['Season'].unique())
episode_counts = episodes_df.groupby('Season')['Episode'].max().cumsum().shift(fill_value=0)

# Function to extract episode descriptions
def get_episode_descriptions(soup, start_episode_id, num_episodes):
    descriptions = []
    for episode_num in range(1, num_episodes + 1):
        episode_id = f"ep{start_episode_id + episode_num - 1}"
        th_tag = soup.find('th', {'id': episode_id})
        if th_tag:
            tr_tag = th_tag.find_parent('tr')
            if tr_tag:
                summary_div = tr_tag.find_next_sibling('tr').find('div', {'class': 'shortSummaryText'})
                if summary_div:
                    descriptions.append(summary_div.get_text(strip=True))
    return descriptions

# Loop through each season
for season in seasons:
    # Build URL for the current season
    url = f"{base_url}{season}"
    print(f"Processing season {season} from URL: {url}")
    
    # Send a request to fetch the HTML content
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Get the starting episode ID for the current season
    start_episode_id = episode_counts.loc[season] + 1
    print(f"Start episode ID for season {season}: {start_episode_id}")
    
    # Get the number of episodes in the current season
    num_episodes = (episodes_df['Season'] == season).sum()
    print(f"Number of episodes in season {season}: {num_episodes}")
    
    # Extract episode descriptions
    episode_descriptions = get_episode_descriptions(soup, start_episode_id, num_episodes)
    
    # Update the DataFrame with the new descriptions
    for i, description in enumerate(episode_descriptions):
        episodes_df.loc[(episodes_df['Season'] == season) & (episodes_df['Episode'] == i + 1), 'Wikipedia Episode Descriptions'] = description

# Save the updated DataFrame to the same CSV file
episodes_df.to_csv(file_path, index=False)

# Display the updated DataFrame to verify
print(episodes_df.head(20))
