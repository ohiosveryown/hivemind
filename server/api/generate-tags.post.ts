export default defineEventHandler(async (event) => {
  try {
    const { title, summary, content } = await readBody(event)

    if (!title && !summary && !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one of title, summary, or content is required'
      })
    }

    // Combine all text for analysis
    const fullText = [title, summary, content].filter(Boolean).join(' ').toLowerCase()

    // Define tag categories with their keywords - more specific and diverse
    const tagCategories = {
      'AI': [
        'artificial intelligence', 'machine learning', 'neural network',
        'deep learning', 'chatgpt', 'gpt', 'llm', 'large language model',
        'algorithm', 'data science', 'predictive', 'automated', 'intelligent',
        'coding agents', 'ai tools', 'generative ai', 'computer vision', 'nlp',
        'natural language processing', 'robotics', 'expert system', 'knowledge base',
        'openai', 'anthropic', 'claude', 'bard', 'copilot', 'github copilot',
        'ai coding', 'autonomous ai', 'ai assistant', 'ai model', 'ai system',
        'ai development', 'ai programming', 'ai code', 'ai agent'
      ],
      'Woodworking': [
        'woodworking', 'carpentry', 'joinery', 'dovetail', 'mortise', 'tenon',
        'woodturning', 'lathe', 'chisel', 'saw', 'plane', 'router', 'drill',
        'wood carving', 'furniture making', 'cabinet making', 'wood finishing',
        'wood stain', 'varnish', 'sanding', 'wood glue', 'clamp', 'workbench',
        'sharpening tools', 'hand tools', 'power tools', 'wood species', 'lumber',
        'woodshop', 'woodcraft', 'woodworking project', 'furniture', 'drawer',
        'board', 'grain', 'end grain', 'baseline', 'knife line', 'saw cut',
        'paring', 'waste removal', 'fret saw', 'jeweller saw', 'tail board',
        'pin board', 'through dovetail', 'half blind dovetail', 'wood joint',
        'woodworking technique', 'woodworking tool', 'woodworking jig',
        'stave core', 'door construction', 'frame and panel', 'wood door',
        'woodworking forum', 'woodworking community', 'woodworking topics'
      ],
      'Programming': [
        'programming', 'coding', 'software development', 'web development',
        'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
        'react', 'vue', 'angular', 'node.js', 'database', 'sql', 'api',
        'library', 'git', 'version control', 'debugging', 'deployment',
        'frontend', 'backend', 'full stack', 'ios', 'android',
        'typescript', 'html', 'css', 'sass', 'scss', 'webpack', 'babel',
        'code review', 'pair programming', 'development workflow', 'code generation',
        'software engineering', 'programming language', 'code editor', 'ide',
        'development tool', 'programming tool', 'code tool'
      ],
      'Design': [
        'ui design', 'ux design', 'user interface design', 'user experience design',
        'graphic design', 'visual design', 'typography', 'color theory', 'wireframe',
        'prototype', 'sketch', 'figma', 'adobe', 'photoshop', 'illustrator',
        'branding', 'logo design', 'icon design', 'illustration', 'animation',
        'responsive design', 'accessibility', 'design system', 'component design',
        'interaction design', 'product design', 'industrial design', 'web design',
        'mobile design', 'app design', 'interface design'
      ],
      'Business': [
        'business', 'startup', 'entrepreneurship', 'marketing', 'sales', 'strategy',
        'management', 'leadership', 'finance', 'investment', 'venture capital',
        'product management', 'customer', 'market', 'revenue', 'profit', 'growth',
        'scaling', 'operations', 'hr', 'human resources', 'legal', 'compliance',
        'business model', 'pitch deck', 'fundraising', 'acquisition'
      ],
      'Health': [
        'health', 'fitness', 'nutrition', 'exercise', 'workout', 'diet', 'wellness',
        'medical', 'medicine', 'therapy', 'mental health', 'physical therapy',
        'yoga', 'meditation', 'mindfulness', 'sleep', 'recovery', 'supplements',
        'vitamins', 'protein', 'cardio', 'strength training', 'flexibility',
        'healthcare', 'doctor', 'hospital', 'treatment', 'diagnosis'
      ],
      'Technology': [
        'computer technology', 'information technology', 'digital technology',
        'hardware', 'software', 'internet', 'cloud computing', 'cybersecurity',
        'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'web3', 'metaverse',
        'virtual reality', 'vr', 'augmented reality', 'ar', 'iot',
        'smart home', 'automation', 'robotics', 'wireless', 'bluetooth', 'wifi',
        'computer science', 'tech industry', 'server', 'database', 'network'
      ],
      'Science': [
        'science', 'research', 'physics', 'chemistry', 'biology', 'mathematics',
        'math', 'statistics', 'experiment', 'hypothesis', 'theory', 'discovery',
        'innovation', 'laboratory', 'analysis', 'data', 'study', 'publication',
        'peer review', 'scientific method', 'evidence', 'proof', 'conclusion',
        'scientist', 'laboratory', 'microscope', 'telescope', 'molecule'
      ],
      'Education': [
        'education', 'learning', 'teaching', 'course', 'tutorial', 'lesson',
        'curriculum', 'academic', 'university', 'college', 'school', 'student',
        'teacher', 'professor', 'lecture', 'assignment', 'homework', 'exam',
        'degree', 'certification', 'training', 'workshop', 'seminar',
        'textbook', 'syllabus', 'grade', 'gpa', 'scholarship'
      ],
      'Movies': [
        'movie review', 'movie trailer', 'movie premiere', 'movie theater', 'movie director',
        'movie actor', 'movie actress', 'movie screenplay', 'movie script', 'movie box office',
        'movie critic', 'movie rating', 'movie oscar', 'movie award', 'movie genre',
        'movie drama', 'movie comedy', 'movie action', 'movie horror', 'movie romance',
        'movie documentary', 'movie indie', 'movie blockbuster', 'movie sequel', 'movie prequel',
        'movie remake', 'movie adaptation', 'film review', 'film trailer', 'film premiere',
        'cinema', 'theater', 'director', 'actor', 'actress', 'screenplay', 'script',
        'box office', 'premiere', 'trailer', 'critic', 'rating', 'oscar', 'award',
        'genre', 'drama', 'comedy', 'action', 'horror', 'romance', 'documentary', 'indie',
        'blockbuster', 'sequel', 'prequel', 'remake', 'adaptation'
      ],
      'Pop Culture': [
        'pop culture', 'celebrity', 'famous', 'star', 'entertainment', 'gossip',
        'trending', 'viral', 'social media', 'influencer', 'youtube', 'tiktok',
        'instagram', 'twitter', 'facebook', 'reality tv', 'talk show',
        'award show', 'red carpet', 'fashion', 'style', 'trend'
      ],
      'Music': [
        'music', 'song', 'album', 'artist', 'band', 'singer', 'musician',
        'concert', 'tour', 'performance', 'lyrics', 'melody', 'rhythm',
        'genre', 'rock', 'pop', 'jazz', 'classical', 'hip hop', 'rap',
        'country', 'electronic', 'folk', 'blues', 'orchestra', 'symphony'
      ],
      'Gaming': [
        'game', 'gaming', 'video game', 'console', 'playstation', 'xbox', 'nintendo',
        'pc gaming', 'mobile game', 'esports', 'streamer', 'twitch', 'youtube gaming',
        'rpg', 'fps', 'strategy', 'puzzle', 'adventure', 'simulation',
        'multiplayer', 'single player', 'online game', 'indie game'
      ],
      'Sports': [
        'sport', 'athletics', 'team', 'player', 'coach', 'game', 'match',
        'tournament', 'championship', 'league', 'season', 'playoff', 'final',
        'football', 'basketball', 'baseball', 'soccer', 'tennis', 'golf',
        'olympics', 'world cup', 'super bowl', 'nba', 'nfl', 'mlb'
      ],
      'Food': [
        'food', 'cooking', 'recipe', 'chef', 'restaurant', 'cuisine', 'kitchen',
        'ingredient', 'meal', 'dish', 'appetizer', 'dessert', 'beverage',
        'baking', 'grilling', 'frying', 'boiling', 'steaming', 'seasoning',
        'spice', 'herb', 'organic', 'vegan', 'vegetarian', 'gluten-free'
      ],
      'Travel': [
        'travel', 'trip', 'vacation', 'destination', 'hotel', 'resort', 'airline',
        'flight', 'airport', 'tourist', 'sightseeing', 'landmark', 'museum',
        'beach', 'mountain', 'city', 'country', 'culture', 'adventure',
        'backpacking', 'luxury travel', 'budget travel', 'road trip'
      ],
      'Politics': [
        'politics', 'political', 'government', 'election', 'vote', 'candidate',
        'president', 'congress', 'senate', 'democrat', 'republican', 'policy',
        'legislation', 'law', 'court', 'supreme court', 'justice', 'campaign',
        'debate', 'poll', 'polling', 'democracy', 'republic', 'constitution'
      ],
      'Arts': [
        'art', 'painting', 'sculpture', 'gallery', 'museum', 'artist', 'exhibition',
        'contemporary art', 'modern art', 'classical art', 'abstract', 'portrait',
        'landscape', 'still life', 'impressionism', 'expressionism', 'cubism',
        'photography', 'photo', 'camera', 'digital art', 'illustration'
      ]
    }

    // Define priority order for tags (higher priority tags should be checked first)
    const tagPriority = [
      'Woodworking', 'Movies', 'Music', 'Gaming', 'Sports', 'Food', 'Travel',
      'AI', 'Programming', 'Design', 'Business', 'Health', 'Technology', 'Science',
      'Education', 'Pop Culture', 'Politics', 'Arts'
    ]

    // Simplified matching logic - just check if keywords are present
    const matchedTags = []

    for (const tag of tagPriority) {
      const keywords = tagCategories[tag as keyof typeof tagCategories]

      for (const keyword of keywords) {
        if (fullText.includes(keyword.toLowerCase())) {
          matchedTags.push(tag)
          break // Only add each tag once per category
        }
      }
    }

    // Apply exclusion rules to prevent false positives
    const finalTags = []
    for (const tag of matchedTags) {
      // If AI is detected, exclude generic technology/design/movies tags
      if (matchedTags.includes('AI')) {
        if (!['Technology', 'Design', 'Movies'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If Programming is detected, exclude generic technology/design/movies tags
      else if (matchedTags.includes('Programming')) {
        if (!['Technology', 'Design', 'Movies'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If woodworking is detected, exclude generic technology/design tags
      else if (matchedTags.includes('Woodworking')) {
        if (!['Technology', 'Design'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If movies are detected, exclude generic technology tags
      else if (matchedTags.includes('Movies')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If music is detected, exclude generic technology tags
      else if (matchedTags.includes('Music')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If gaming is detected, exclude generic technology tags
      else if (matchedTags.includes('Gaming')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If sports are detected, exclude generic technology tags
      else if (matchedTags.includes('Sports')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If food is detected, exclude generic technology tags
      else if (matchedTags.includes('Food')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If travel is detected, exclude generic technology tags
      else if (matchedTags.includes('Travel')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // If arts are detected, exclude generic technology tags
      else if (matchedTags.includes('Arts')) {
        if (!['Technology'].includes(tag)) {
          finalTags.push(tag)
        }
      }
      // Default case: include all tags
      else {
        finalTags.push(tag)
      }
    }

    // Remove duplicates and sort
    const uniqueTags = [...new Set(finalTags)].sort()

    return {
      tags: uniqueTags
    }

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to generate tags'
    })
  }
})