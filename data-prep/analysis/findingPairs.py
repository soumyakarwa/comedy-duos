import pandas as pd
import numpy as np
import json

# Load the JSON file
input_file_path = '../cleanedData-withAnalysis.json'
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Convert the JSON data to a DataFrame
df = pd.json_normalize(data)

def filter_sentences(data):
    if data and isinstance(data, list):
        filtered_entries = [entry for entry in data if len(entry['characters']) > 1]
        return filtered_entries
    return np.nan

# Apply the filtering function to the specified columns and create new columns
df['Episode Description Filtered'] = df['Episode Description Analysis'].apply(filter_sentences)
df['Wiki Fandom Description Filtered'] = df['Wiki Fandom Description Analysis'].apply(filter_sentences)
df['Wikipedia Clauses Filtered'] = df['Wikipedia Clauses Analysis'].apply(filter_sentences)

# Convert the DataFrame back to a list of dictionaries
output_data = df.to_dict(orient='records')

# Save the updated data to a new JSON file
output_file_path = '../../frontend/svelte-app/public/data/brooklynNineNineCharacters.json'  # Replace with the desired output file path
with open(output_file_path, 'w') as file:
    json.dump(output_data, file, indent=4)

print("Filtering complete. The results are saved in the new columns and written to the file brooklynNineNineCharacters.json")
