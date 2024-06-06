import pandas as pd
import json

# Path to your JSON file
input_file_path = '../../frontend/svelte-app/public/data/brooklynNineNineCharacters.json'
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Convert the JSON data to a DataFrame
df = pd.json_normalize(data)

# Function to extract characters from column data
def extract_characters(column_data):
    if column_data is not None and isinstance(column_data, list):
        return column_data
    return []

# Function to filter the smallest units
def filter_smallest_units(groups):
    groups.sort(key=len)
    smallest_units = []
    for group in groups:
        group_set = set(group)
        if not any(set(unit).issubset(group_set) for unit in smallest_units):
            smallest_units.append(group)
    return smallest_units

# Process each row independently
def streamline_row(row):
    combined_characters = []
    for column in ['Episode Description Filtered', 'Wiki Fandom Description Filtered', 'Wikipedia Clauses Filtered']:
        characters_list = extract_characters(row[column])
        combined_characters.extend([item['characters'] for item in characters_list])
    streamlined_characters = filter_smallest_units(combined_characters)
    return streamlined_characters

# Apply the streamline_row function to each row in the DataFrame
df['Streamlined Characters'] = df.apply(streamline_row, axis=1)

# Convert the DataFrame back to a list of dictionaries
output_data = df.to_dict(orient='records')

# Save the updated data to a new JSON file
output_file_path = '../../frontend/svelte-app/public/data/brooklynNineNineCharactersStreamlined.json'
with open(output_file_path, 'w') as file:
    json.dump(output_data, file, indent=4)

print("Streamlining complete. The results are saved in a new column and written to the file brooklynNineNineCharactersStreamlined.json.")
