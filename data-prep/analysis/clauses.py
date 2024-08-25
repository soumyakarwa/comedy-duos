import pandas as pd
import json
import subprocess

# Load the JSON file
input_file_path = '../cleanedData.json'

# Read the JSON file into a dictionary
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Normalize the JSON structure
df = pd.json_normalize(data)

# Create the 'Wikipedia Clauses Analysis' column
df['Wikipedia Description Clauses'] = [[] for _ in range(len(df))]

# Function to break a sentence into its independent clauses using a subprocess
def break_sentence_into_clauses(sentence):
    data_str = json.dumps(sentence)
    result = subprocess.run(
        ['deno', 'run', '-A', 'clauses.js', data_str],
        capture_output=True,
        text=True
    )
    # Extract the JSON part from the output
    output_lines = result.stdout.split('\n')
    json_output = None
    for line in output_lines:
        try:
            json_output = json.loads(line)
            break
        except json.JSONDecodeError:
            continue
    return json_output

# Process each row in the DataFrame
for i in range(len(df)):
    cell = df['Wikipedia Description Analysis'].iloc[i]
    try:
        entries = cell
    except (ValueError, SyntaxError) as e:
        print(f"Error evaluating literal in row {i}: {e}")
        print(f"Cell content: {cell}")
        continue
    
    wikipedia_clauses_analysis = []
    for entry in entries:
        if len(entry['characters']) > 2:
            sentence = entry['sentence']
            clauses = break_sentence_into_clauses(sentence)
            if clauses:
                for clause in clauses:
                    wikipedia_clauses_analysis.append(clause)
            else:
                wikipedia_clauses_analysis.append(sentence)
        else:
            wikipedia_clauses_analysis.append(entry['sentence'])
    
    # Store the clauses in the new column
    df.at[i, 'Wikipedia Description Clauses'] = wikipedia_clauses_analysis

# Convert the DataFrame back to a list of dictionaries
output_data = df.to_dict(orient='records')

# Save the updated data to a new JSON file
output_file_path = '../cleanedData-withClauses.json'
with open(output_file_path, 'w') as file:
    json.dump(output_data, file, indent=4)

print("Wikipedia Description Analysis is checked for any list of characters that exceed three. If yes, the Deno subprocess is called to separate the sentence into independent clauses. The clauses are saved in 'Wikipedia Clauses Analysis'. File is saved into cleanedData-withClauses.json")
