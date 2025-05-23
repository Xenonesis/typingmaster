interface CodeSnippet {
  code: string;
  language: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

// Collection of code snippets categorized by programming language and difficulty
export const codeSnippets: CodeSnippet[] = [
  // JavaScript snippets
  {
    language: 'javascript',
    title: 'Hello World Function',
    difficulty: 'beginner',
    description: 'A simple hello world function in JavaScript',
    code: `function sayHello() {
  console.log("Hello, World!");
}

// Call the function
sayHello();`
  },
  {
    language: 'javascript',
    title: 'Array Map and Filter',
    difficulty: 'intermediate',
    description: 'Using array map and filter methods',
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers and double them
const doubledEvens = numbers
  .filter(num => num % 2 === 0)
  .map(num => num * 2);

console.log(doubledEvens); // [4, 8, 12, 16, 20]`
  },
  {
    language: 'javascript',
    title: 'Async/Await Example',
    difficulty: 'advanced',
    description: 'Using async/await with promises',
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

// Using the async function
fetchUserData(123)
  .then(user => console.log(user))
  .catch(error => console.error(error));`
  },

  // Python snippets
  {
    language: 'python',
    title: 'Hello World',
    difficulty: 'beginner',
    description: 'A simple hello world program in Python',
    code: `def say_hello():
    print("Hello, World!")

# Call the function
say_hello()`
  },
  {
    language: 'python',
    title: 'List Comprehension',
    difficulty: 'intermediate',
    description: 'Using list comprehension in Python',
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Get squares of even numbers
even_squares = [num**2 for num in numbers if num % 2 == 0]

print(even_squares)  # [4, 16, 36, 64, 100]`
  },
  {
    language: 'python',
    title: 'Decorators',
    difficulty: 'advanced',
    description: 'Using decorators in Python',
    code: `import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds to run")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    print("Function complete")

# Call the decorated function
slow_function()`
  },

  // TypeScript snippets
  {
    language: 'typescript',
    title: 'Basic Types',
    difficulty: 'beginner',
    description: 'Basic type annotations in TypeScript',
    code: `// Basic types in TypeScript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// Function with type annotations
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("TypeScript"));`
  },
  {
    language: 'typescript',
    title: 'Interfaces',
    difficulty: 'intermediate',
    description: 'Using interfaces in TypeScript',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles?: string[];  // Optional property
}

function createUser(user: User): User {
  // Create user logic here
  return user;
}

const newUser: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
  roles: ["admin", "editor"]
};

console.log(createUser(newUser));`
  },
  {
    language: 'typescript',
    title: 'Generics',
    difficulty: 'advanced',
    description: 'Using generics in TypeScript',
    code: `// Generic function
function getFirstElement<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

// Generic class
class Queue<T> {
  private data: T[] = [];

  push(item: T): void {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.shift();
  }

  peek(): T | undefined {
    return this.data[0];
  }

  get length(): number {
    return this.data.length;
  }
}

// Usage
const numberQueue = new Queue<number>();
numberQueue.push(10);
numberQueue.push(20);
console.log(numberQueue.pop());  // 10
console.log(numberQueue.length); // 1`
  },

  // Java snippets
  {
    language: 'java',
    title: 'Hello World Class',
    difficulty: 'beginner',
    description: 'A simple hello world class in Java',
    code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  {
    language: 'java',
    title: 'ArrayList Operations',
    difficulty: 'intermediate',
    description: 'Using ArrayList in Java',
    code: `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ArrayListExample {
    public static void main(String[] args) {
        // Create an ArrayList
        List<String> fruits = new ArrayList<>();
        
        // Add elements
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Orange");
        fruits.add("Mango");
        
        // Print the list
        System.out.println("Fruits: " + fruits);
        
        // Remove an element
        fruits.remove("Banana");
        
        // Using stream to filter and collect
        List<String> filteredFruits = fruits.stream()
            .filter(fruit -> fruit.startsWith("A") || fruit.startsWith("O"))
            .collect(Collectors.toList());
        
        System.out.println("Filtered fruits: " + filteredFruits);
    }
}`
  },
  {
    language: 'java',
    title: 'Multithreading',
    difficulty: 'advanced',
    description: 'Using multithreading in Java',
    code: `public class ThreadExample {
    public static void main(String[] args) {
        // Creating a thread using Runnable interface
        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 5; i++) {
                    System.out.println("Thread 1: " + i);
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
        
        // Creating a thread using lambda expression
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Thread 2: " + i);
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        // Start the threads
        thread1.start();
        thread2.start();
        
        System.out.println("Main thread continues execution...");
    }
}`
  },

  // C# snippets
  {
    language: 'csharp',
    title: 'Hello World',
    difficulty: 'beginner',
    description: 'A simple hello world program in C#',
    code: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        // Wait for user input before closing
        Console.ReadLine();
    }
}`
  },
  {
    language: 'csharp',
    title: 'LINQ Operations',
    difficulty: 'intermediate',
    description: 'Using LINQ in C#',
    code: `using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        
        // LINQ query syntax
        var evenNumbers = from num in numbers
                          where num % 2 == 0
                          select num;
                          
        Console.WriteLine("Even numbers (Query syntax):");
        foreach (var num in evenNumbers)
        {
            Console.Write($"{num} ");
        }
        
        // LINQ method syntax
        var oddNumbers = numbers.Where(n => n % 2 != 0)
                                .OrderByDescending(n => n);
        
        Console.WriteLine("\\nOdd numbers (Method syntax):");
        foreach (var num in oddNumbers)
        {
            Console.Write($"{num} ");
        }
        
        Console.ReadLine();
    }
}`
  },
  {
    language: 'csharp',
    title: 'Async/Await Pattern',
    difficulty: 'advanced',
    description: 'Using async/await in C#',
    code: `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        Console.WriteLine("Starting the download...");
        
        // Asynchronously download web content
        string content = await DownloadWebPageAsync("https://example.com");
        
        Console.WriteLine($"Downloaded {content.Length} characters");
        Console.WriteLine("Download completed!");
        
        Console.ReadLine();
    }
    
    static async Task<string> DownloadWebPageAsync(string url)
    {
        using (HttpClient client = new HttpClient())
        {
            Console.WriteLine("Downloading...");
            
            // Asynchronous HTTP request
            string result = await client.GetStringAsync(url);
            
            // Simulate additional processing time
            await Task.Delay(1000);
            
            return result;
        }
    }
}`
  },

  // Ruby snippets
  {
    language: 'ruby',
    title: 'Hello World',
    difficulty: 'beginner',
    description: 'A simple hello world program in Ruby',
    code: `def say_hello
  puts "Hello, World!"
end

# Call the function
say_hello`
  },
  {
    language: 'ruby',
    title: 'Array Operations',
    difficulty: 'intermediate',
    description: 'Working with arrays in Ruby',
    code: `# Create an array
fruits = ["apple", "banana", "orange", "mango", "grape"]

# Array iteration with each
puts "Fruits list:"
fruits.each { |fruit| puts "- #{fruit}" }

# Map transformation
uppercase_fruits = fruits.map { |fruit| fruit.upcase }
puts "\\nUppercased fruits:"
puts uppercase_fruits

# Filter with select
fruits_with_a = fruits.select { |fruit| fruit.include?("a") }
puts "\\nFruits containing 'a':"
puts fruits_with_a

# Using reject (opposite of select)
fruits_without_e = fruits.reject { |fruit| fruit.include?("e") }
puts "\\nFruits without 'e':"
puts fruits_without_e`
  },
  {
    language: 'ruby',
    title: 'Classes and Modules',
    difficulty: 'advanced',
    description: 'Using classes and modules in Ruby',
    code: `# Define a module for shared functionality
module Loggable
  def log(message)
    puts "[#{self.class}] #{message}"
  end
end

# Base class
class Animal
  include Loggable
  
  attr_reader :name
  
  def initialize(name)
    @name = name
    log("Animal #{name} created")
  end
  
  def speak
    raise NotImplementedError, "Subclasses must implement this method"
  end
end

# Subclass
class Dog < Animal
  def initialize(name, breed)
    super(name)
    @breed = breed
  end
  
  def speak
    log("#{@name} says: Woof!")
  end
  
  def description
    "#{@name} is a #{@breed}"
  end
end

# Create and use objects
dog = Dog.new("Rex", "German Shepherd")
dog.speak
puts dog.description`
  },

  // PHP snippets
  {
    language: 'php',
    title: 'Hello World',
    difficulty: 'beginner',
    description: 'A simple hello world program in PHP',
    code: `<?php
function sayHello() {
    echo "Hello, World!";
}

// Call the function
sayHello();
?>`
  },
  {
    language: 'php',
    title: 'Array Functions',
    difficulty: 'intermediate',
    description: 'Working with arrays in PHP',
    code: `<?php
// Create an array
$fruits = array("apple", "banana", "orange", "mango", "grape");

// Print the array
echo "Fruits array: ";
print_r($fruits);

// Using array_map to transform elements
$uppercase_fruits = array_map(function($fruit) {
    return strtoupper($fruit);
}, $fruits);

echo "Uppercase fruits: ";
print_r($uppercase_fruits);

// Using array_filter to filter elements
$fruits_with_a = array_filter($fruits, function($fruit) {
    return strpos($fruit, 'a') !== false;
});

echo "Fruits containing 'a': ";
print_r($fruits_with_a);

// Associative array
$fruit_colors = array(
    "apple" => "red",
    "banana" => "yellow",
    "orange" => "orange",
    "grape" => "purple"
);

echo "Fruit colors: ";
foreach ($fruit_colors as $fruit => $color) {
    echo "$fruit is $color, ";
}
?>`
  },
  {
    language: 'php',
    title: 'OOP in PHP',
    difficulty: 'advanced',
    description: 'Object-oriented programming in PHP',
    code: `<?php
// Interface definition
interface Loggable {
    public function log($message);
}

// Abstract class
abstract class Animal implements Loggable {
    protected $name;
    
    public function __construct($name) {
        $this->name = $name;
        $this->log("Animal $name created");
    }
    
    public function log($message) {
        echo "[" . get_class($this) . "] $message\\n";
    }
    
    // Abstract method to be implemented by subclasses
    abstract public function speak();
}

// Concrete class
class Dog extends Animal {
    private $breed;
    
    public function __construct($name, $breed) {
        parent::__construct($name);
        $this->breed = $breed;
    }
    
    public function speak() {
        $this->log("{$this->name} says: Woof!");
    }
    
    public function getDescription() {
        return "{$this->name} is a {$this->breed}";
    }
}

// Create and use objects
$dog = new Dog("Rex", "German Shepherd");
$dog->speak();
echo $dog->getDescription();
?>`
  },

  // Go snippets
  {
    language: 'go',
    title: 'Hello World',
    difficulty: 'beginner',
    description: 'A simple hello world program in Go',
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`
  },
  {
    language: 'go',
    title: 'Goroutines',
    difficulty: 'intermediate',
    description: 'Using goroutines and channels in Go',
    code: `package main

import (
    "fmt"
    "time"
)

func printNumbers(name string, delay time.Duration) {
    for i := 1; i <= 5; i++ {
        time.Sleep(delay)
        fmt.Printf("%s: %d\\n", name, i)
    }
}

func main() {
    // Start two goroutines
    go printNumbers("Goroutine 1", 500*time.Millisecond)
    go printNumbers("Goroutine 2", 700*time.Millisecond)
    
    // Using a channel for communication
    ch := make(chan string)
    
    go func() {
        time.Sleep(3 * time.Second)
        ch <- "Channel message received!"
    }()
    
    // Wait for channel message
    fmt.Println("Waiting for message...")
    message := <-ch
    fmt.Println(message)
    
    // Give goroutines time to complete
    time.Sleep(4 * time.Second)
    fmt.Println("Main function completed")
}`
  },
  {
    language: 'go',
    title: 'Interfaces and Structs',
    difficulty: 'advanced',
    description: 'Working with interfaces and structs in Go',
    code: `package main

import (
    "fmt"
    "math"
)

// Define an interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Rectangle struct
type Rectangle struct {
    Width  float64
    Height float64
}

// Implement Shape interface for Rectangle
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Circle struct
type Circle struct {
    Radius float64
}

// Implement Shape interface for Circle
func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

// Function that works with any Shape
func PrintShapeDetails(s Shape) {
    fmt.Printf("Area: %.2f\\n", s.Area())
    fmt.Printf("Perimeter: %.2f\\n", s.Perimeter())
}

func main() {
    // Create a Rectangle
    r := Rectangle{Width: 5, Height: 3}
    fmt.Println("Rectangle:")
    PrintShapeDetails(r)
    
    // Create a Circle
    c := Circle{Radius: 2}
    fmt.Println("\\nCircle:")
    PrintShapeDetails(c)
}`
  },
];

// Function to get code snippets filtered by language and/or difficulty
export const getCodeSnippets = (
  language?: string,
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): CodeSnippet[] => {
  let filteredSnippets = [...codeSnippets];
  
  if (language) {
    filteredSnippets = filteredSnippets.filter(snippet => snippet.language === language);
  }
  
  if (difficulty) {
    filteredSnippets = filteredSnippets.filter(snippet => snippet.difficulty === difficulty);
  }
  
  return filteredSnippets;
};

// Function to get a random code snippet
export const getRandomCodeSnippet = (
  language?: string,
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): CodeSnippet => {
  const filteredSnippets = getCodeSnippets(language, difficulty);
  const randomIndex = Math.floor(Math.random() * filteredSnippets.length);
  return filteredSnippets[randomIndex];
};

// Get all available languages
export const getLanguages = (): string[] => {
  const languages = new Set(codeSnippets.map(snippet => snippet.language));
  return Array.from(languages);
};

// Get language display name (more readable format)
export const getLanguageDisplayName = (language: string): string => {
  const displayNames: Record<string, string> = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'csharp': 'C#',
    'ruby': 'Ruby',
    'php': 'PHP',
    'go': 'Go'
  };
  
  return displayNames[language] || language;
};
