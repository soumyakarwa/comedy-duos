import pandas as pd

# Path to your CSV file
file_path = '../../frontend/svelte-app/public/data/brooklynNineNineCharacters.csv' 

# Read the CSV file into a DataFrame
df = pd.read_csv(file_path)

# Function to extract characters from column data
def extract_characters(column_data):
    if pd.notnull(column_data):
        try:
            return eval(column_data) if column_data else []
        except:
            return []
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

# Save the updated DataFrame to a new CSV file
# output_file_path = '../../test.csv'
df.to_csv(file_path, index=False)

print("Streamlining. The results are saved in a new column and written to the file brooklynNineNineCharacters.csv")

