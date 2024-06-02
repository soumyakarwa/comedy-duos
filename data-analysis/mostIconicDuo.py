import pandas as pd
from collections import defaultdict
import ast

# Path to your CSV file
file_path = '../brooklynNineNineCharacters.csv'

# Read the CSV file into a DataFrame
df = pd.read_csv(file_path)

# [frequency, cumulativeWeightedRating, totalVotes, totalRating]
characterRatingDict = defaultdict(lambda: [0, 0.0, 0, 0])  

# Access the 'Streamlined Characters', 'Rating', and 'Total Votes' columns
characterColumn = df['Streamlined Characters']
ratingColumn = df['Rating']
votesColumn = df['Total Votes']

for characters, rating, votes in zip(characterColumn, ratingColumn, votesColumn):
    if characters: 
        try:
            # Convert the string representation of list to actual list
            pairs = ast.literal_eval(characters)  
            for pair in pairs:
                if isinstance(pair, list):
                    # Sort the pair alphabetically and convert to tuple
                    sorted_pair = tuple(sorted(pair))  
                    characterRatingDict[sorted_pair][0] += 1  
                    characterRatingDict[sorted_pair][1] += rating * votes 
                    characterRatingDict[sorted_pair][2] += votes
                    characterRatingDict[sorted_pair][3] += rating
        except (SyntaxError, ValueError):
            continue

# Convert defaultdict to a regular dictionary
characterRatingDict = {k: tuple(v) for k, v in characterRatingDict.items()}

# Sort the dictionary in descending order of frequency
sortedCharacterRatingDict = dict(sorted(characterRatingDict.items(), key=lambda item: item[1][0], reverse=True))

# Print the sorted dictionary with average ratings
for entry, (frequency, cumulativeWeightedRating, totalVotes, totalRating) in sortedCharacterRatingDict.items():
    averageCumulativeRating = cumulativeWeightedRating / totalVotes if totalVotes > 0 else 0
    averageRating = totalRating / frequency if frequency > 0 else 0
    print(f"Pair: {entry}, Frequency: {frequency},   Average Cumulative Rating: {averageCumulativeRating:.2f}, Average Rating: {averageRating:.2f} Rating Difference: {averageCumulativeRating - averageRating:.2f}")
