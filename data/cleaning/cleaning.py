import pandas as pd

# Load the CSV file
file_path = '../analysis/episode_descriptions_analysis.csv'

# Define the characters to retain
characters = ["Jake", "Peralta", "Raymond", "Holt", "Terry", "Jeffords", "Amy", "Santiago",
              "Rosa", "Diaz", "Gina", "Linetti", "Charles", "Boyle", "Norm", "Scully", "Michael", "Hitchcock"]

# Read the data from the CSV file
df = pd.read_csv(file_path)

# Function to clean up the analysis columns while maintaining the 2-D array structure
def clean_analysis_column(column):
    cleaned_data = []
    for entry in column:
        if isinstance(entry, str) and entry.startswith('[['):
            # Convert string representation of list of lists to actual list of lists
            entry_list = eval(entry)
            cleaned_entry = []
            for sublist in entry_list:
                # Filter out non-character entries and remove duplicates within each sublist
                unique_chars = set()
                cleaned_sublist = []
                for name in sublist:
                    for char in characters:
                        if char in name and char not in unique_chars:
                            unique_chars.add(char)
                            cleaned_sublist.append(char)
                            break
                cleaned_entry.append(cleaned_sublist)
            cleaned_data.append(cleaned_entry)
        else:
            cleaned_data.append(entry)
    return cleaned_data

# Apply the cleaning function to the last three columns
df['Episode Description Analysis'] = clean_analysis_column(df['Episode Description Analysis'])
df['Wiki Fandom Description Analysis'] = clean_analysis_column(df['Wiki Fandom Description Analysis'])
df['Wikipedia Description Analysis'] = clean_analysis_column(df['Wikipedia Description Analysis'])

# Save the cleaned data to a new CSV file
cleaned_file_path = 'cleaned_data.csv'
df.to_csv(cleaned_file_path, index=False)

print(f"Cleaned data has been saved to {cleaned_file_path}")
