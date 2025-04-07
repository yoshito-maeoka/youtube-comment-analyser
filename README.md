# YouTube Comment Analyzer

A Node.js tool to fetch and analyze comments from YouTube videos.

## Features

- Fetch comments from any YouTube video
- Basic sentiment analysis of comments
- Option to save comments in chunks
- IPv4 support for connection issues
- Export analysis results to JSON

## Prerequisites

- Node.js
- YouTube Data API key

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

## Usage

Basic usage:
```bash
node index.js VIDEO_ID
```

Options:
- `-4, --ipv4`: Force IPv4 connection
- `-w, --write-chunks`: Write comments into separate chunk files
- `-o, --output <filename>`: Specify output file for analysis results (default: analysis-results.json)

Examples:
```bash
# Basic usage
node index.js dQw4w9WgXcQ

# With IPv4 and chunk writing
node index.js dQw4w9WgXcQ -4 -w

# Custom output file
node index.js dQw4w9WgXcQ -o my-analysis.json
```

## Output

The tool generates a JSON file containing:
- Total number of comments
- Sentiment analysis (positive, negative, neutral percentages)
- Most liked comment
- Full comment data

## License

MIT 