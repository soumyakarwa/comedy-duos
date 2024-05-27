import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.tag import pos_tag
from nltk.chunk import ne_chunk
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktParameters

# Download necessary NLTK data files
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('maxent_ne_chunker')
nltk.download('words')

# Function to split paragraph into sentences
def split_into_sentences(paragraph):
    sentences = sent_tokenize(paragraph)
    return sentences

# Function to split sentences into clauses
def split_into_clauses(sentence):
    punkt_param = PunktParameters()
    sentence_splitter = PunktSentenceTokenizer(punkt_param)
    clauses = sentence_splitter.tokenize(sentence)
    return clauses

# Function to extract proper nouns from text
def extract_proper_nouns(text):
    words = word_tokenize(text)
    pos_tags = pos_tag(words)
    named_entities = ne_chunk(pos_tags, binary=True)
    proper_nouns = []
    for chunk in named_entities:
        if hasattr(chunk, 'label') and chunk.label() == 'NE':
            proper_nouns.extend([c[0] for c in chunk])
    return proper_nouns

# Function to analyze paragraph
def analyze_paragraph(paragraph):
    sentences = split_into_sentences(paragraph)
    analysis = []
    for sentence in sentences:
        clauses = split_into_clauses(sentence)
        for clause in clauses:
            proper_nouns = extract_proper_nouns(clause)
            analysis.append({
                'clause': clause,
                'proper_nouns': proper_nouns
            })
    return analysis

# Example paragraph
paragraph = "The entire squad is invited to Captain Holt's birthday party, where Terry struggles to keep everyone in line. Jake tries to make a great first impression with Holt's husband Kevin, as does Amy with Holt, but with disastrous results. Boyle's love of food leads him to make a new romantic connection with an older woman named Vivian, while Rosa unleashes Gina onto a group ofabnormal psychologistswho find her fascinating."

# Analyze the paragraph
analysis = analyze_paragraph(paragraph)

# Print the results
for item in analysis:
    print(f"Clause: {item['clause']}")
    print(f"Proper Nouns: {item['proper_nouns']}")
    print()
