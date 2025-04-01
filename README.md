# YouTube Comment Analyzer

A command-line tool that analyzes comments from YouTube videos, providing sentiment analysis and engagement metrics.

## Features

- Fetches comments from YouTube videos using the YouTube Data API
- Performs basic sentiment analysis on comments
- Identifies most liked comments
- Provides statistics on positive, negative, and neutral comments
- Saves analysis results to JSON file
- Command-line interface with configurable options

## Prerequisites

- Node.js (v14 or higher)
- YouTube Data API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-comment-analyser.git
cd youtube-comment-analyser
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root and add your YouTube API key:
```bash
YOUTUBE_API_KEY=your_api_key_here
```

## Usage

Basic usage:
```bash
node index.js -v <video_id>
```

Options:
- `-v, --video-id <videoId>`: YouTube video ID (required)
- `-o, --output <filename>`: Output file for analysis results (default: "analysis-results.json")
- `-h, --help`: Display help information
- `-V, --version`: Display version information

Example:
```bash
node index.js -v jslQB_tRMMg -o my-analysis.json
```

## Output

The tool generates a JSON file containing:
- All comments with their metadata
- Sentiment analysis results
- Most liked comment
- Statistics on comment distribution

Example output structure:
```json
{
  "comments": [
    {
      "text": "Comment text",
      "author": "Author name",
      "publishedAt": "2024-03-21T12:00:00Z",
      "likeCount": 42
    }
  ],
  "analysis": {
    "total": 100,
    "positive": 60,
    "negative": 20,
    "neutral": 20,
    "positivePercentage": "60.00",
    "negativePercentage": "20.00",
    "neutralPercentage": "20.00",
    "mostLiked": {
      "text": "Most liked comment text",
      "author": "Author name",
      "publishedAt": "2024-03-21T12:00:00Z",
      "likeCount": 100
    }
  }
}
```

## Getting a YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API key)
5. Copy the API key to your `.env` file

## Error Handling

The tool provides clear error messages for common issues:
- Missing video ID
- Missing API key
- API errors
- File system errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
- [Commander.js](https://github.com/tj/commander.js) 