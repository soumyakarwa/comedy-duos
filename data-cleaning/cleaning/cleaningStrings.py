import pandas as pd
import re

# Function to clean the text
def clean_text(text):
    # Remove escape characters
    text = text.replace('\\', '')
    # Remove text within square brackets
    text = re.sub(r'\[.*?\]', '', text)
    return text.strip()

# Load the CSV file
file_path = '../brooklynNineNineEpisodeDescriptions.csv'  # Update this with the actual file path
data = pd.read_csv(file_path)

# Apply the cleaning function to relevant columns
for column in ['Episode Description', 'Wiki Fandom Descriptions', 'Wikipedia Episode Descriptions']:
    data[column] = data[column].apply(clean_text)

# Save the cleaned data back to a CSV file
cleaned_file_path = 'test.csv'  # This will save the cleaned file with 'cleaned_' prefix
data.to_csv(cleaned_file_path, index=False)

print(f"Cleaned data saved to {cleaned_file_path}")
