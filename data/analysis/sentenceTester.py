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
        analysis.append({
            # 'sentence': sentence,
            'proper_nouns': proper_nouns
        })
    return analysis

# Example paragraph
paragraph = "Jake has a slew of unsolved cases that he can't seem to close, and the other detectives don't want his losing streak to rub off on them. Meanwhile, Holt asks Amy to run lead on the Junior Policeman Program for at-risk youth, and she enlists Rosa and Gina's help. Also, Boyle helps Sergeant Jeffords with a special case he cannot solve.[1]"

# Analyze the paragraph 
analysis = analyze_paragraph(paragraph)

# Print the results
for item in analysis:
    print(f"Sentence: {item['sentence']}")
    print(f"Proper Nouns: {item['proper_nouns']}")
    print()
