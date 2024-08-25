import pandas as pd
import ast
import json

# input_file_path = "../analysisByCharacters.json"
input_file_path = "../cleanedData-withAnalysis.json"

# Validate and read the JSON file manually
with open(input_file_path, 'r') as file:
    data = file.read()
    print("Raw JSON Data:")
    print(data[:1000])  # Print the first 1000 characters to check if it looks correct

# Try to parse the JSON content
try:
    json_data = json.loads(data)
    print("Parsed JSON Data:")
    print(json_data[:5])  # Print the first 5 records of parsed JSON data
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    exit(1)

# Load the JSON data into a DataFrame
df = pd.DataFrame(json_data)
print("DataFrame Head:")
print(df.head())  # Print the head of the DataFrame

characterDictionary = {
    "Jake": ["Jake", "Peralta"],
    "Amy": ["Amy", "Santiago"],
    "Holt": ["Captain", "Capt.", "Raymond", "Ray", "Holt"],
    "Terry": ["Sergeant", "Terrence", "Terry", "Jeffords"],
    "Rosa": ["Rosa", "Diaz"],
    "Gina": ["Gina", "Linetti"],
    "Charles": ["Charles", "Boyle"],
}

# Create a reverse dictionary to map aliases to main character names
reverseCharacterDictionary = {alias: key for key, aliases in characterDictionary.items() for alias in aliases}

def unifyCharacters(character_list, reverse_dict):
    unified_list = []
    for character in character_list:
        main_character = reverse_dict.get(character, character)
        if main_character not in unified_list:
            unified_list.append(main_character)
    return unified_list

def processEntry(entry, reverse_dict):
    if isinstance(entry, list):
        for item in entry:
            if 'characters' in item:
                item['characters'] = unifyCharacters(item['characters'], reverse_dict)
    return entry

def safeEval(item):
    try:
        return ast.literal_eval(item)
    except (ValueError, SyntaxError):
        return item

columns_to_process = [
    # 'Episode Description Analysis', 
    # 'Wiki Fandom Description Analysis', 
    # 'Wikipedia Description Analysis',
    'Wikipedia Clauses Analysis'
]

# Apply the unification process to the specified columns
for column in columns_to_process:
    if column in df.columns:
        df[column] = df[column].apply(lambda x: processEntry(safeEval(x), reverseCharacterDictionary) if isinstance(safeEval(x), list) else x)

print("Processed DataFrame Head:")
print(df.head())  # Print the head of the processed DataFrame

# Save the updated DataFrame back to a JSON file
# output_file_path = "../cleanedData.json"
output_file_path = "../cleanedData-withAnalysis.json"
with open(output_file_path, 'w') as file:
    json.dump(json.loads(df.to_json(orient='records')), file, indent=4)

print(f"DataFrame saved to {output_file_path}")
