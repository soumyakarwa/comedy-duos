import pandas as pd
import ast

df = pd.read_csv("../analysisByCharacters.csv")

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
    for item in character_list:
        if isinstance(item, list):  # Process nested lists
            sublist = unify_characters(item, reverse_dict)
            unified_list.append(sublist)
        else:
            main_character = reverse_dict.get(item, item)
            if main_character not in unified_list:
                unified_list.append(main_character)
    return unified_list

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
            lambda x: unify_characters(safe_eval(x), reverseCharacterDictionary) if pd.notnull(x) else x
        )

df.to_csv("../cleanedData.csv", index=False)

print("The CSV file has been processed and saved successfully.")