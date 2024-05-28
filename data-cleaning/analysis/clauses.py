import pandas as pd
import subprocess
import json
import ast

# Load the CSV file
file_path = '../cleanedData.csv' 
df = pd.read_csv(file_path)

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

# Create a new column to store the independent clauses
df['Wikipedia Description Clauses'] = None

for i in range(len(df)):
    cell = df['Wikipedia Description Analysis'].iloc[i]
    try:
        entries = ast.literal_eval(cell)
    except (ValueError, SyntaxError) as e:
        print(f"Error evaluating literal in row {i}: {e}")
        print(f"Cell content: {cell}")
        continue
    
    clauses_list = []
    for entry in entries:
        # if the characters aren't paired
        if len(entry['characters']) > 2:
            sentence = entry['sentence']
            clauses = break_sentence_into_clauses(sentence)
            if clauses:
                clauses_list.extend(clauses)
            else:
                clauses_list.append(sentence)
        else:
            clauses_list.append(entry['sentence'])
    
    # Store the clauses in the new column
    df.at[i, 'Wikipedia Description Clauses'] = clauses_list

# Save the updated DataFrame to a new CSV file
output_file_path = '../cleanedData-withClauses.csv' 
df.to_csv(output_file_path, index=False)

print("Wikipedia Description Analysis is checked for any list of charactersts that exceed three. If yes, OPEN AI API is called to separate the sentence into independent clauses. File is saved into cleanedData-withClauses.csv")