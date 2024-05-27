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


def split_into_sentences(paragraph):
    # Split paragraph into sentences
    sentences = sent_tokenize(paragraph)
    return sentences

def extract_proper_nouns(sentence):
    # Tokenize the sentence
    words = word_tokenize(sentence)
    # Tag the tokens with part of speech
    pos_tags = pos_tag(words)
    # Perform named entity recognition
    named_entities = ne_chunk(pos_tags, binary=True)
    
    proper_nouns = []
    for chunk in named_entities:
        if hasattr(chunk, 'label') and chunk.label() == 'NE':
            proper_nouns.extend([c[0] for c in chunk])
    return proper_nouns

def analyze_paragraph(paragraph):
    sentences = split_into_sentences(paragraph)
    analysis = []
    for sentence in sentences:
        proper_nouns = extract_proper_nouns(sentence)
        analysis.append(
            # 'sentence': sentence,
            proper_nouns
        )
    return analysis

# Read the CSV file
file_path = '../brooklyn_99_episodes_updated.csv'  # Replace with the actual file path
df = pd.read_csv(file_path)

# Analyze each episode description
epsiode_description_analysis = []
for description in df['Episode Description']:
    if pd.notnull(description):
        analysis = analyze_paragraph(description)
        epsiode_description_analysis.append(analysis)
    else:
        epsiode_description_analysis.append(None)

# Add the analysis results to the DataFrame
df['Episode Description Analysis'] = epsiode_description_analysis 

wikifandom_description_analysis = []
for description in df['Wiki Fandom Descriptions']:
    if pd.notnull(description):
        analysis = analyze_paragraph(description)
        wikifandom_description_analysis.append(analysis)
    else:
        wikifandom_description_analysis.append(None)

# Add the analysis results to the DataFrame
df['Wiki Fandom Description Analysis'] = wikifandom_description_analysis

wikipedia_description_analysis = []
for description in df['Wikipedia Episode Descriptions']:
    if pd.notnull(description):
        analysis = analyze_paragraph(description)
        wikipedia_description_analysis.append(analysis)
    else:
        wikipedia_description_analysis.append(None)

# Add the analysis results to the DataFrame
df['Wikipedia Description Analysis'] = wikipedia_description_analysis


# Save the updated DataFrame to a new CSV file
output_file_path = 'episode_descriptions_analysis.csv'
df.to_csv(output_file_path, index=False)

print("analysis complete")
