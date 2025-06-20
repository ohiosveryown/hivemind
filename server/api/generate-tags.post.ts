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

    // Define tag categories with their keywords
    const tagCategories = {
      'AI': [
        'artificial intelligence', 'ai', 'machine learning', 'ml', 'neural network',
        'deep learning', 'chatgpt', 'gpt', 'llm', 'large language model', 'automation',
        'algorithm', 'data science', 'predictive', 'automated', 'intelligent',
        'coding agents', 'ai tools', 'generative ai', 'computer vision', 'nlp',
        'natural language processing', 'robotics', 'expert system', 'knowledge base'
      ],
      'Woodworking': [
        'woodworking', 'wood', 'carpentry', 'joinery', 'dovetail', 'mortise', 'tenon',
        'woodturning', 'lathe', 'chisel', 'saw', 'plane', 'router', 'drill',
        'wood carving', 'furniture making', 'cabinet making', 'wood finishing',
        'wood stain', 'varnish', 'sanding', 'wood glue', 'clamp', 'workbench',
        'sharpening tools', 'hand tools', 'power tools', 'wood species', 'lumber'
      ],
      'Programming': [
        'programming', 'coding', 'software development', 'web development',
        'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
        'react', 'vue', 'angular', 'node.js', 'database', 'sql', 'api', 'framework',
        'library', 'git', 'version control', 'debugging', 'testing', 'deployment',
        'frontend', 'backend', 'full stack', 'mobile development', 'ios', 'android'
      ],
      'Design': [
        'design', 'ui', 'ux', 'user interface', 'user experience', 'graphic design',
        'visual design', 'typography', 'color theory', 'layout', 'wireframe',
        'prototype', 'sketch', 'figma', 'adobe', 'photoshop', 'illustrator',
        'in design', 'branding', 'logo', 'icon', 'illustration', 'animation',
        'responsive design', 'accessibility', 'design system', 'component'
      ],
      'Business': [
        'business', 'startup', 'entrepreneurship', 'marketing', 'sales', 'strategy',
        'management', 'leadership', 'finance', 'investment', 'venture capital',
        'product management', 'customer', 'market', 'revenue', 'profit', 'growth',
        'scaling', 'operations', 'hr', 'human resources', 'legal', 'compliance'
      ],
      'Health': [
        'health', 'fitness', 'nutrition', 'exercise', 'workout', 'diet', 'wellness',
        'medical', 'medicine', 'therapy', 'mental health', 'physical therapy',
        'yoga', 'meditation', 'mindfulness', 'sleep', 'recovery', 'supplements',
        'vitamins', 'protein', 'cardio', 'strength training', 'flexibility'
      ],
      'Technology': [
        'technology', 'tech', 'computer', 'hardware', 'software', 'internet',
        'cloud', 'cybersecurity', 'blockchain', 'cryptocurrency', 'bitcoin',
        'ethereum', 'web3', 'metaverse', 'virtual reality', 'vr', 'augmented reality',
        'ar', 'iot', 'internet of things', 'smart home', 'automation', 'robotics'
      ],
      'Science': [
        'science', 'research', 'physics', 'chemistry', 'biology', 'mathematics',
        'math', 'statistics', 'experiment', 'hypothesis', 'theory', 'discovery',
        'innovation', 'laboratory', 'analysis', 'data', 'study', 'publication',
        'peer review', 'scientific method', 'evidence', 'proof', 'conclusion'
      ],
      'Education': [
        'education', 'learning', 'teaching', 'course', 'tutorial', 'lesson',
        'curriculum', 'academic', 'university', 'college', 'school', 'student',
        'teacher', 'professor', 'lecture', 'assignment', 'homework', 'exam',
        'degree', 'certification', 'training', 'workshop', 'seminar'
      ]
    }

    // Find matching tags
    const matchedTags = []

    for (const [tag, keywords] of Object.entries(tagCategories)) {
      for (const keyword of keywords) {
        if (fullText.includes(keyword)) {
          matchedTags.push(tag)
          break // Only add each tag once per category
        }
      }
    }

    // Remove duplicates and sort
    const uniqueTags = [...new Set(matchedTags)].sort()

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