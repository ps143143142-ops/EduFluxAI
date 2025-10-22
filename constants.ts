import { Course, User, Resource, DSAProblem } from './types';

// These are now SEED data for the first-time database initialization in apiService.ts
// They are not used directly in components anymore.

export const ADMIN_USER_SEED: User = {
    id: 'admin01',
    name: 'Admin User',
    email: 'admin@eduflux.ai',
    password: 'admin',
    role: 'admin',
    enrolledCourses: [],
    externalAccounts: [],
    isVerified: true,
};

export const STUDENT_USER_SEED: User = {
    id: 'student01',
    name: 'Alex Johnson',
    email: 'alex@eduflux.ai',
    password: 'alex',
    role: 'student',
    enrolledCourses: ['c1', 'c3'],
    externalAccounts: [
        { platform: 'LeetCode', username: 'alex_j', profileUrl: '#', stats: { solvedCount: 150, ranking: 10250 }, lastSynced: '2024-07-28T10:00:00Z' },
        { platform: 'HackerRank', username: 'alex_j_hr', profileUrl: '#', apiKey: 'dummy_api_key_12345', stats: { solvedCount: 85, ranking: 5120 }, lastSynced: '2024-07-27T18:30:00Z' },
    ],
    isVerified: true,
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Java Full-Stack Mastery',
    description: 'Become a complete Java developer. From Spring Boot to React, this course covers it all.',
    instructor: 'Dr. Evelyn Reed',
    price: 49.99,
    tags: ['Java', 'Spring Boot', 'Full-Stack'],
    imageUrl: 'https://picsum.photos/seed/java/600/400',
    type: 'paid',
    modules: [
        { title: '1. Introduction (Completed)', status: 'Completed' },
        { title: '2. Setting up Java', status: 'Completed' },
        { title: '3. Spring Boot Basics', status: 'In Progress' },
        { title: '4. RESTful APIs', status: 'Not Started' },
        { title: '5. Connecting to a Database', status: 'Not Started' },
    ],
    downloads: [
        { title: 'Lecture_Slides.pdf', type: 'pdf', url: '#' },
        { title: 'Lecture_Snippets.zip', type: 'zip', url: '#' },
        { title: 'Code_Snippets.zip', type: 'zip', url: '#' },
    ]
  },
  {
    id: 'c2',
    title: 'AI & Machine Learning Deep Dive',
    description: 'Explore the world of AI with Python, TensorFlow, and PyTorch. Build real-world models.',
    instructor: 'Prof. Kenji Tanaka',
    price: 79.99,
    tags: ['AI', 'Machine Learning', 'Python'],
    imageUrl: 'https://picsum.photos/seed/ai/600/400',
    type: 'paid',
    modules: [],
    downloads: []
  },
  {
    id: 'c3',
    title: 'Modern Frontend with React & Tailwind',
    description: 'Create beautiful, responsive user interfaces with React, TypeScript, and Tailwind CSS.',
    instructor: 'Maria Garcia',
    price: 39.99,
    tags: ['React', 'Frontend', 'Tailwind CSS'],
    imageUrl: 'https://picsum.photos/seed/react/600/400',
    type: 'paid',
    modules: [
        { title: '1. Introduction to React', status: 'Completed' },
        { title: '2. State and Props', status: 'Completed' },
        { title: '3. Hooks Deep Dive', status: 'Completed' },
        { title: '4. Styling with Tailwind CSS', status: 'In Progress' },
    ],
    downloads: [
        { title: 'React_Cheatsheet.pdf', type: 'pdf', url: '#' },
        { title: 'Project_Files.zip', type: 'zip', url: '#' },
    ]
  },
  {
    id: 'c4',
    title: 'Cloud Native with Docker & Kubernetes',
    description: 'Learn to deploy and manage scalable applications using containerization and orchestration.',
    instructor: 'David Chen',
    price: 59.99,
    tags: ['Cloud', 'DevOps', 'Kubernetes'],
    imageUrl: 'https://picsum.photos/seed/cloud/600/400',
    type: 'paid',
    modules: [],
    downloads: []
  },
  {
    id: 'c5',
    title: 'Data Science & Big Data Analytics',
    description: 'Master data analysis, visualization, and big data technologies like Spark and Hadoop.',
    instructor: 'Dr. Aisha Khan',
    price: 69.99,
    tags: ['Data Science', 'Big Data', 'Analytics'],
    imageUrl: 'https://picsum.photos/seed/datascience/600/400',
    type: 'paid',
    modules: [],
    downloads: []
  },
  {
    id: 'c6',
    title: 'Introduction to Data Structures',
    description: 'A beginner-friendly introduction to fundamental data structures like arrays, linked lists, and trees.',
    instructor: 'Community Contribution',
    price: 0,
    tags: ['DSA', 'Beginner', 'Free'],
    imageUrl: 'https://picsum.photos/seed/dsa/600/400',
    type: 'free',
    modules: [],
    downloads: []
  },
];

export const MOCK_RESOURCES: Resource[] = [
    { id: 'r1', type: 'youtube', title: 'Spring Boot Tutorial for Beginners', description: 'A complete 4-hour course on Spring Boot.', url: '#', category: 'Java' },
    { id: 'r2', type: 'book', title: 'Clean Code by Robert C. Martin', description: 'A handbook of agile software craftsmanship.', url: '#', category: 'Software Design' },
    { id: 'r3', type: 'article', title: 'Understanding React Hooks', description: 'A deep dive into useState and useEffect.', url: '#', category: 'React' },
    { id: 'r4', type: 'pdf', title: 'The Kubernetes Handbook', description: 'An overview of K8s concepts.', url: '#', category: 'Cloud' },
    { id: 'r5', type: 'link', title: 'GeeksforGeeks DSA Problems', description: 'Practice data structures and algorithms.', url: '#', category: 'DSA' },
    { id: 'r6', type: 'youtube', title: 'MIT 6.006: Intro to Algorithms', description: 'Classic lectures from MIT on algorithms.', url: '#', category: 'DSA' },
];

export const MOCK_DSA_PROBLEMS: { category: string, problems: DSAProblem[] }[] = [
    {
        category: 'Arrays',
        problems: [
            { id: 'dsa1', title: 'Two Sum', difficulty: 'Easy', url: '#', platform: 'LeetCode' },
            { id: 'dsa2', title: 'Container With Most Water', difficulty: 'Medium', url: '#', platform: 'LeetCode' },
        ]
    },
    {
        category: 'Linked Lists',
        problems: [
            { id: 'dsa3', title: 'Reverse a Linked List', difficulty: 'Easy', url: '#', platform: 'HackerRank' },
            { id: 'dsa4', title: 'Merge K Sorted Lists', difficulty: 'Hard', url: '#', platform: 'LeetCode' },
        ]
    },
    {
        category: 'Trees',
        problems: [
            { id: 'dsa5', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: '#', platform: 'GeeksforGeeks' },
            { id: 'dsa6', title: 'Validate Binary Search Tree', difficulty: 'Medium', url: '#', platform: 'LeetCode' },
        ]
    },
    {
        category: 'Dynamic Programming',
        problems: [
            { id: 'dsa7', title: 'Climbing Stairs', difficulty: 'Easy', url: '#', platform: 'LeetCode' },
            { id: 'dsa8', title: 'Longest Palindromic Substring', difficulty: 'Medium', url: '#', platform: 'CodeChef' },
        ]
    },
];