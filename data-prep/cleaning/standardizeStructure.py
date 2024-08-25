import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
import numpy as np
import json

# Download necessary NLTK data files
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

characters = ["Jake", "Peralta", "Captain", "Raymond", "Holt", "Sergeant", "Terry", "Jeffords", "Amy", "Santiago", "Rosa", "Diaz", "Gina", "Linetti", "Charles", "Boyle"]

def extractCharacterNames(sentence, characters):
    # Tokenize the sentence
    if isinstance(sentence, str):
        words = word_tokenize(sentence)
        # Check for the presence of character names
        found_characters = [word for word in words if word in characters]
        return found_characters
    else:
        return []

def analyzeParagraph(sentences):
    analysis = []
    for sentence in sentences:
        chars = extractCharacterNames(sentence, characters)
        analysis.append({
            'sentence': sentence,
            'characters': chars,
        })
    return analysis

# Load the JSON file
input_file_path = '../cleanedData-withClauses.json'  # Replace with the actual file path
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Convert the JSON data to a DataFrame
df = pd.json_normalize(data)

# Conduct analysis on the "Wikipedia Clauses Analysis" column
df['Wikipedia Clauses Analysis'] = df['Wikipedia Description Clauses'].apply(
    lambda x: analyzeParagraph(x) if isinstance(x, list) and x else np.nan
)

# Convert the DataFrame back to a list of dictionaries
output_data = df.to_dict(orient='records')

# Save the updated data to a new JSON file
output_file_path = '../cleanedData-withAnalysis.json'
with open(output_file_path, 'w') as file:
    json.dump(output_data, file, indent=4)

print("Analysis complete. The results are saved in the new column 'Wikipedia Clauses Analysis' and written to the file cleanedData-withAnalysis.json.")
