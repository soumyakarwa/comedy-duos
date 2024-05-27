// Parse the command-line argument as JSON
const data = JSON.parse(process.argv[2]);

// Process the data if it meets the criteria
if (data.criteria) {
  data.processed = true;
} else {
  data.processed = false;
}

// Output the processed data as a JSON string
console.log(JSON.stringify(data));
