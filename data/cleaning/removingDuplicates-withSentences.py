import pandas as pd
import ast

# Load the CSV file into a DataFrame
df = pd.read_csv("../analysisByCharacters-withSentences.csv")

characterDictionary = {
    "Jake": ["Jake", "Peralta"],
    "Amy": ["Amy", "Santiago"],
    "Holt": ["Captain", "Capt.", "Raymond", "Ray", "Holt"],
    "Terry": ["Sergeant", "Terrence", "Terry", "Jeffords"],
    "Rosa": ["Rosa", "Diaz"],
    "Gina": ["Gina", "Linetti"],
    "Charles": ["Charles", "Boyle"],
    "Scully": ["Norm", "Scully"],
    "Hitchcock": ["Michael", "Hitchcock"]
}

# Create a reverse dictionary to map aliases to main character names
reverseCharacterDictionary = {}
for key, aliases in characterDictionary.items():
    for alias in aliases:
        reverseCharacterDictionary[alias] = key

def unify_characters(character_list, reverse_dict):
    unified_list = []
    for character in character_list:
        main_character = reverse_dict.get(character, character)
        if main_character not in unified_list:
            unified_list.append(main_character)
    return unified_list

def process_entry(entry, reverse_dict):
    for item in entry:
        if 'characters' in item:
            item['characters'] = unify_characters(item['characters'], reverse_dict)
    return entry

def safe_eval(item):
    try:
        return ast.literal_eval(item)
    except (ValueError, SyntaxError):
        return item

columns_to_process = [
    'Episode Description Analysis', 
    'Wiki Fandom Description Analysis', 
    'Wikipedia Description Analysis'
]

# Apply the unification process to the specified columns
for column in columns_to_process:
    if column in df.columns:
        df[column] = df[column].apply(
            lambda x: process_entry(safe_eval(x), reverseCharacterDictionary) if pd.notnull(x) else x
        )

# Save the updated DataFrame back to a CSV file
df.to_csv("../cleanedData-withSentences.csv", index=False)

print("The CSV file has been processed and saved successfully.")

