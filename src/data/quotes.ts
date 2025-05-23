interface Quote {
  text: string;
  author: string;
  category: string;
  length: 'short' | 'medium' | 'long';
}

// Collection of quotes categorized by length and topic
export const quotes: Quote[] = [
  // Short quotes (under 100 characters)
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "inspiration",
    length: "short"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "life",
    length: "short"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "inspiration",
    length: "short"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "motivation",
    length: "short"
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "life",
    length: "short"
  },
  
  // Medium quotes (100-200 characters)
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts. The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Winston Churchill",
    category: "success",
    length: "medium"
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
    author: "Steve Jobs",
    category: "inspiration",
    length: "medium"
  },
  {
    text: "In the end, it's not the years in your life that count. It's the life in your years. The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Abraham Lincoln",
    category: "life",
    length: "medium"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall. The way to get started is to quit talking and begin doing.",
    author: "Nelson Mandela",
    category: "perseverance",
    length: "medium"
  },
  {
    text: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough. The best and most beautiful things in the world cannot be seen.",
    author: "Oprah Winfrey",
    category: "gratitude",
    length: "medium"
  },
  
  // Long quotes (over 200 characters)
  {
    text: "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover. Life is either a daring adventure or nothing at all.",
    author: "Mark Twain",
    category: "adventure",
    length: "long"
  },
  {
    text: "Watch your thoughts, they become your words; watch your words, they become your actions; watch your actions, they become your habits; watch your habits, they become your character; watch your character, it becomes your destiny. What we think, we become.",
    author: "Lao Tzu",
    category: "mindfulness",
    length: "long"
  },
  {
    text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. There is no greater agony than bearing an untold story inside you. Success is liking yourself, liking what you do, and liking how you do it.",
    author: "Maya Angelou",
    category: "inspiration",
    length: "long"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams. Do what you feel in your heart to be right – for you'll be criticized anyway. You'll be damned if you do, and damned if you don't. The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "courage",
    length: "long"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions. Our prime purpose in this life is to help others. And if you can't help them, at least don't hurt them. The purpose of our lives is to be happy. Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "happiness",
    length: "long"
  },
  
  // Technology quotes
  {
    text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
    author: "Bill Gates",
    category: "technology",
    length: "short"
  },
  {
    text: "It has become appallingly obvious that our technology has exceeded our humanity. We can't solve problems by using the same kind of thinking we used when we created them.",
    author: "Albert Einstein",
    category: "technology",
    length: "medium"
  },
  
  // Programming quotes
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    category: "programming",
    length: "short"
  },
  {
    text: "First, solve the problem. Then, write the code. Programming isn't about what you know; it's about what you can figure out. The only way to learn a new programming language is by writing programs in it.",
    author: "Dennis Ritchie",
    category: "programming",
    length: "medium"
  },
  {
    text: "The best error message is the one that never shows up. Measuring programming progress by lines of code is like measuring aircraft building progress by weight. Good code is its own best documentation. As you're about to add a comment, ask yourself, 'How can I improve the code so that this comment isn't needed?'",
    author: "Steve McConnell",
    category: "programming",
    length: "long"
  },
  
  // Business quotes
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
    category: "business",
    length: "short"
  },
  {
    text: "The secret of change is to focus all of your energy, not on fighting the old, but on building the new. If you are not willing to risk the usual, you will have to settle for the ordinary.",
    author: "Socrates",
    category: "business",
    length: "medium"
  },
  
  // Science quotes
  {
    text: "The important thing is to not stop questioning. Curiosity has its own reason for existing.",
    author: "Albert Einstein",
    category: "science",
    length: "short"
  },
  {
    text: "Science is a way of thinking much more than it is a body of knowledge. We live in a society exquisitely dependent on science and technology, in which hardly anyone knows anything about science and technology.",
    author: "Carl Sagan",
    category: "science",
    length: "medium"
  }
];

// Function to get quotes filtered by category and/or length
export const getQuotes = (
  category?: string,
  length?: 'short' | 'medium' | 'long'
): Quote[] => {
  let filteredQuotes = [...quotes];
  
  if (category) {
    filteredQuotes = filteredQuotes.filter(quote => quote.category === category);
  }
  
  if (length) {
    filteredQuotes = filteredQuotes.filter(quote => quote.length === length);
  }
  
  return filteredQuotes;
};

// Function to get a random quote
export const getRandomQuote = (
  category?: string,
  length?: 'short' | 'medium' | 'long'
): Quote => {
  const filteredQuotes = getQuotes(category, length);
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex];
};

// Get all available categories
export const getCategories = (): string[] => {
  const categories = new Set(quotes.map(quote => quote.category));
  return Array.from(categories);
};
