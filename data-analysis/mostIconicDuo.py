import pandas as pd
from collections import defaultdict
import json

# Path to your JSON file
file_path = '../frontend/svelte-app/public/data/brooklynNineNineCharactersStreamlined.json'

# Read the JSON file into a DataFrame
with open(file_path, 'r') as f:
    data = json.load(f)
df = pd.DataFrame(data)

# [frequency, cumulativeWeightedRating, totalVotes, totalRating]
characterRatingDict = defaultdict(lambda: [0, 0.0, 0, 0])

# Access the 'Streamlined Characters', 'Rating', and 'Total Votes' columns
characterColumn = df['Streamlined Characters']
ratingColumn = df['Rating']
votesColumn = df['Total Votes']

for characters, rating, votes in zip(characterColumn, ratingColumn, votesColumn):
    if characters: 
        try:
            # Iterate over the pairs directly since they are lists
            for pair in characters:
                if isinstance(pair, list):
                    # Sort the pair alphabetically and convert to tuple
                    sorted_pair = tuple(sorted(pair))  
                    characterRatingDict[sorted_pair][0] += 1  
                    characterRatingDict[sorted_pair][1] += rating * votes 
                    characterRatingDict[sorted_pair][2] += votes
                    characterRatingDict[sorted_pair][3] += rating
        except (TypeError, ValueError):
            continue

# Convert defaultdict to a regular dictionary
characterRatingDict = {k: tuple(v) for k, v in characterRatingDict.items()}

# Sort the dictionary in descending order of frequency
sortedCharacterRatingDict = dict(sorted(characterRatingDict.items(), key=lambda item: item[1][0], reverse=True))

# Print the sorted dictionary with average ratings
for entry, (frequency, cumulativeWeightedRating, totalVotes, totalRating) in sortedCharacterRatingDict.items():
    averageCumulativeRating = cumulativeWeightedRating / totalVotes if totalVotes > 0 else 0
    averageRating = totalRating / frequency if frequency > 0 else 0
    print(f"Pair: {entry}, Frequency: {frequency}, Average Cumulative Rating: {averageCumulativeRating:.2f}, Average Rating: {averageRating:.2f}, Rating Difference: {averageCumulativeRating - averageRating:.2f}")
