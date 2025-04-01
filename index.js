const { google } = require('googleapis');
const { program } = require('commander');
const fs = require('fs');

require('dotenv').config();

// YouTube API setup
async function getYoutubeComments(videoId, apiKey) {
  const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
  });

  let comments = [];
  let nextPageToken = null;

  try {
    do {
      const response = await youtube.commentThreads.list({
        part: 'snippet',
        videoId: videoId,
        maxResults: 100,
        pageToken: nextPageToken
      });

      const items = response.data.items;
      
      items.forEach(item => {
        const comment = {
          text: item.snippet.topLevelComment.snippet.textDisplay,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
          likeCount: item.snippet.topLevelComment.snippet.likeCount
        };
        
        comments.push(comment);
      });

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return comments;
  } catch (error) {
    console.error('Error fetching YouTube comments:', error.message);
    throw error;
  }
}

// Comment analysis functions
function splitIntoChunks(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function analyzeComments(comments) {
  // Basic sentiment analysis (very simplified)
  const positiveKeywords = ['good', 'great', 'love', 'amazing', 'excellent', 'awesome', 'thanks', 'thank you'];
  const negativeKeywords = ['bad', 'poor', 'hate', 'terrible', 'awful', 'worst', 'disappointing'];
  
  let results = {
    total: comments.length,
    positive: 0,
    negative: 0,
    neutral: 0,
    mostLiked: null,
    mostLikedCount: 0
  };

  comments.forEach(comment => {
    const text = comment.text.toLowerCase();
    
    // Find most liked comment
    if (comment.likeCount > results.mostLikedCount) {
      results.mostLikedCount = comment.likeCount;
      results.mostLiked = comment;
    }
    
    // Simple sentiment detection
    const positiveMatches = positiveKeywords.filter(word => text.includes(word)).length;
    const negativeMatches = negativeKeywords.filter(word => text.includes(word)).length;
    
    if (positiveMatches > negativeMatches) {
      results.positive++;
    } else if (negativeMatches > positiveMatches) {
      results.negative++;
    } else {
      results.neutral++;
    }
  });
  
  results.positivePercentage = ((results.positive / results.total) * 100).toFixed(2);
  results.negativePercentage = ((results.negative / results.total) * 100).toFixed(2);
  results.neutralPercentage = ((results.neutral / results.total) * 100).toFixed(2);
  
  return results;
}

// Main function to run the analysis
async function analyzeYoutubeComments(videoId, apiKey, writeChunks = false) {
  try {
    console.log(`Fetching comments for video: ${videoId}`);
    const comments = await getYoutubeComments(videoId, apiKey);
    console.log(`Retrieved ${comments.length} comments`);
    
    // Split and save comments into chunks if writeChunks option is enabled
    if (writeChunks) {
      const commentChunks = splitIntoChunks(comments, 100);
      console.log(`Split comments into ${commentChunks.length} chunks of 100 comments each`);
      
      // Save each chunk to a separate file
      commentChunks.forEach((chunk, index) => {
        const filename = `${videoId}-chunk-${index + 1}-comments.json`;
        fs.writeFileSync(filename, JSON.stringify(chunk, null, 2));
        console.log(`Saved chunk ${index + 1} to ${filename}`);
      });
    }

    const analysis = analyzeComments(comments);
    
    console.log('\nComment Analysis:');
    console.log(`Total Comments: ${analysis.total}`);
    console.log(`Positive Comments: ${analysis.positive} (${analysis.positivePercentage}%)`);
    console.log(`Negative Comments: ${analysis.negative} (${analysis.negativePercentage}%)`);
    console.log(`Neutral Comments: ${analysis.neutral} (${analysis.neutralPercentage}%)`);
    
    if (analysis.mostLiked) {
      console.log('\nMost Liked Comment:');
      console.log(`Author: ${analysis.mostLiked.author}`);
      console.log(`Likes: ${analysis.mostLiked.likeCount}`);
      console.log(`Text: ${analysis.mostLiked.text}`);
    }
    
    return {
      comments,
      analysis
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

// CLI setup
program
  .name('youtube-comment-analyzer')
  .description('Analyze comments from a YouTube video')
  .version('1.0.0')
  .requiredOption('-v, --video-id <videoId>', 'YouTube video ID')
  .option('-o, --output <filename>', 'Output file for analysis results', 'analysis-results.json')
  .option('-w, --write-chunks', 'Write comments into separate chunk files')
  .action(async (options) => {
    if (!process.env.YOUTUBE_API_KEY) {
      console.error('Error: YOUTUBE_API_KEY not found in .env file');
      console.error('Please create a .env file with your YouTube API key:');
      console.error('YOUTUBE_API_KEY=your_api_key_here');
      process.exit(1);
    }

    try {
      const result = await analyzeYoutubeComments(options.videoId, process.env.YOUTUBE_API_KEY, options.writeChunks);
      
      // Save results to file
      fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
      console.log(`\nAnalysis results saved to ${options.output}`);
    } catch (err) {
      console.error('Program failed:', err);
      process.exit(1);
    }
  });

program.parse();

module.exports = {
  getYoutubeComments,
  analyzeComments,
  analyzeYoutubeComments
};
