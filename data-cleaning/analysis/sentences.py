import pandas as pd
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk

# Download necessary NLTK data files
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

characters = ["Jake", "Peralta", "Captain", "Raymond", "Holt", "Sergeant", "Terry", "Jeffords", "Amy", "Santiago", "Rosa", "Diaz", "Gina", "Linetti", "Charles", "Boyle", "Norm", "Scully", "Michael", "Hitchcock"]

def splitIntoSentences(paragraph):
    sentences = sent_tokenize(paragraph)
    return sentences

def extractCharacterNames(sentence, characters):
    # Tokenize the sentence
    words = word_tokenize(sentence)
    # Check for the presence of character names
    found_characters = [word for word in words if word in characters]
    return found_characters

def analyzeParagraph(paragraph):
    sentences = splitIntoSentences(paragraph)
    analysis = []
    for sentence in sentences:
        chars = extractCharacterNames(sentence, characters)
        analysis.append({
            'sentence': sentence,
            'characters': chars,
        })
    return analysis

# Read the CSV file
file_path = '../brooklynNineNineEpisodeDescriptions.csv' 
df = pd.read_csv(file_path)

def analyzeDescriptions(descriptions, analysis_function):
    return [analysis_function(description) if pd.notnull(description) else None for description in descriptions]

# Analyze each description type and add the results to the DataFrame
df['Episode Description Analysis'] = analyzeDescriptions(df['Episode Description'], analyzeParagraph)
df['Wiki Fandom Description Analysis'] = analyzeDescriptions(df['Wiki Fandom Descriptions'], analyzeParagraph)
df['Wikipedia Description Analysis'] = analyzeDescriptions(df['Wikipedia Episode Descriptions'], analyzeParagraph)

# Save the updated DataFrame to a new CSV file
output_file_path = '../analysisByCharacters.csv'
df.to_csv(output_file_path, index=False)

print("All descriptions are analysed into sentences and corresponding character. File is saved into analysisByCharacters.csv")
