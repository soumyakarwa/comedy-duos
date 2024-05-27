import subprocess
import json

# Sample data
data = "Boyle makes Peralta his best man, which means cake tasting, picking stationery, and helping Charles convince Vivian that he doesn't want to relocate to Canada. Meanwhile Gina, Amy, and the Sergeant attempt a team diet plan, and Holt makes Rosa apologize to a patrol officer whom she humiliated."

# Convert data to JSON string
data_str = json.dumps(data)

result = subprocess.run(
    ['deno', 'run', '-A', 'clauses.js', data_str],
    capture_output=True,
    text=True
)

# Process the output
# Extract the JSON part from the output
output_lines = result.stdout.split('\n')
json_output = None
for line in output_lines:
    try:
        json_output = json.loads(line)
        break
    except json.JSONDecodeError:
        continue

# Process the output
if json_output is not None:
    # Do something with the clauses
    print(json_output)
else:
    print("Error decoding JSON.")
    print("Output was:", result.stdout)