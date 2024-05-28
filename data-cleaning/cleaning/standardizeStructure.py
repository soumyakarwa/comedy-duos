import pandas as pd
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
import ast
import numpy as np

# Download necessary NLTK data files
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

characters = ["Jake", "Peralta", "Captain", "Raymond", "Holt", "Sergeant", "Terry", "Jeffords", "Amy", "Santiago", "Rosa", "Diaz", "Gina", "Linetti", "Charles", "Boyle", "Norm", "Scully", "Michael", "Hitchcock"]

def extractCharacterNames(sentence, characters):
    # Tokenize the sentence
    words = word_tokenize(sentence)
    # Check for the presence of character names
    found_characters = [word for word in words if word in characters]
    return found_characters

def analyzeParagraph(sentences):
    analysis = []
    for sentence in sentences:
        chars = extractCharacterNames(sentence, characters)
        analysis.append({
            'sentence': sentence,
            'characters': chars,
        })
    return analysis

# Load the CSV file
file_path = '../cleanedData-withClauses.csv'  # Replace with the actual file path
df = pd.read_csv(file_path)

# Conduct analysis on the "Wikipedia Description Clauses" column
df['Wikipedia Clauses Analysis'] = df['Wikipedia Description Clauses'].apply(
    lambda x: analyzeParagraph(ast.literal_eval(x)) if pd.notna(x) else np.nan
)

# Save the updated DataFrame to a new CSV file
output_file_path = '../cleanedData-withAnalysis.csv'
df.to_csv(output_file_path, index=False)

print("Analysis complete. The results are saved in the new column 'Wikipedia Clauses Analysis' and written to the file cleanedData-withAnalysis.csv.")
