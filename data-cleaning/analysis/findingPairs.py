import pandas as pd
import ast
import numpy as np

# Load the CSV file
file_path = '../cleanedData-withAnalysis.csv'  
df = pd.read_csv(file_path)

def filter_sentences(data):
    if pd.notna(data) and data != '':
        entries = ast.literal_eval(data)
        filtered_entries = [entry for entry in entries if len(entry['characters']) > 1]
        return filtered_entries
    return np.nan

# Apply the filtering function to the specified columns and create new columns
df['Episode Description Filtered'] = df['Episode Description Analysis'].apply(filter_sentences)
df['Wiki Fandom Description Filtered'] = df['Wiki Fandom Description Analysis'].apply(filter_sentences)
df['Wikipedia Clauses Filtered'] = df['Wikipedia Clauses Analysis'].apply(filter_sentences)

# Save the updated DataFrame to a new CSV file
output_file_path = '../../frontend/svelte-app/public/data/brooklynNineNineCharacters.csv'  # Replace with the desired output file path
df.to_csv(output_file_path, index=False)

print("Filtering complete. The results are saved in the new columns and written to the file brooklynNineNineCharacters.csv")
