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

def split_into_sentences(paragraph):
    # Split paragraph into sentences
    sentences = sent_tokenize(paragraph)
    return sentences

# def extract_proper_nouns(sentence):
#     # Tokenize the sentence
#     words = word_tokenize(sentence)
#     # Tag the tokens with part of speech
#     pos_tags = pos_tag(words)
#     # Perform named entity recognition
#     named_entities = ne_chunk(pos_tags, binary=True)
    
#     proper_nouns = []
#     for chunk in named_entities:
#         if hasattr(chunk, 'label') and chunk.label() == 'NE':
#             proper_nouns.extend([c[0] for c in chunk])
#     return proper_nouns

def extract_character_names(sentence, characters):
    # Tokenize the sentence
    words = word_tokenize(sentence)
    # Check for the presence of character names
    found_characters = [word for word in words if word in characters]
    return found_characters

def analyze_paragraph(paragraph):
    sentences = split_into_sentences(paragraph)
    analysis = []
    for sentence in sentences:
        chars = extract_character_names(sentence, characters)
        analysis.append({
            'sentence': sentence,
            'characters': chars,
        })
    return analysis

# Read the CSV file
file_path = '../brooklynNineNineEpisodeDescriptions.csv'  # Replace with the actual file path
df = pd.read_csv(file_path)

def analyze_descriptions(descriptions, analysis_function):
    return [analysis_function(description) if pd.notnull(description) else None for description in descriptions]

# Analyze each description type and add the results to the DataFrame
df['Episode Description Analysis'] = analyze_descriptions(df['Episode Description'], analyze_paragraph)
df['Wiki Fandom Description Analysis'] = analyze_descriptions(df['Wiki Fandom Descriptions'], analyze_paragraph)
df['Wikipedia Description Analysis'] = analyze_descriptions(df['Wikipedia Episode Descriptions'], analyze_paragraph)


# Save the updated DataFrame to a new CSV file
output_file_path = '../analysisByCharacters-withSentences.csv'
df.to_csv(output_file_path, index=False)

print("analysis complete")
