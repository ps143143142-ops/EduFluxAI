
import { User, Course, Resource, DSAProblem, LeaderboardUser, Payment } from '../types';
import { MOCK_COURSES, MOCK_RESOURCES, MOCK_DSA_PROBLEMS, ADMIN_USER_SEED, STUDENT_USER_SEED } from '../constants';

const DB_KEY = 'edufluxai_db';

interface Database {
  users: User[];
  courses: Course[];
  resources: Resource[];
  dsaProblems: { category: string, problems: DSAProblem[] }[];
  otpStore: Record<string, { otp: string, expires: number }>;
  loginOtpStore: Record<string, { otp: string, expires: number }>;
  transactions: Payment[];
}

// --- Database Initialization and Access ---

const getDb = (): Database => {
  const dbString = localStorage.getItem(DB_KEY);
  if (!dbString) {
    return initializeDb();
  }
  return JSON.parse(dbString);
};

const saveDb = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const initializeDb = (): Database => {
  console.log("Initializing database in localStorage...");
  const initialDb: Database = {
    users: [ADMIN_USER_SEED, STUDENT_USER_SEED],
    courses: MOCK_COURSES,
    resources: MOCK_RESOURCES,
    dsaProblems: MOCK_DSA_PROBLEMS,
    otpStore: {},
    loginOtpStore: {},
    transactions: [
        { transactionId: 'tx1', userId: 'student01', courseId: 'c1', amount: 49.99, timestamp: '2024-07-20T10:00:00Z' },
        { transactionId: 'tx2', userId: 'student01', courseId: 'c3', amount: 39.99, timestamp: '2024-07-25T15:30:00Z' },
    ],
  };
  saveDb(initialDb);
  return initialDb;
};

// Ensure DB is initialized on first load
if (!localStorage.getItem(DB_KEY)) {
    initializeDb();
}

// --- User and Auth Management ---

export const requestOtp = (name: string, email: string, password: string): { success: boolean, message: string } => {
  const db = getDb();
  
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // Create temporary user, will be verified later
  const newUser: User = {
    id: `student_${Date.now()}`,
    name,
    email,
    password, // In a real app, this would be hashed
    role: 'student',
    enrolledCourses: [],
    externalAccounts: [],
    isVerified: false,
  };
  
  db.users.push(newUser);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  db.otpStore[email.toLowerCase()] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
  };

  saveDb(db);
  
  // Simulate sending OTP via email
  alert(`DEV ONLY: Your OTP for ${email} is: ${otp}`);

  return { success: true, message: 'An OTP has been sent to your email.' };
};

export const verifyOtpAndRegister = (email: string, otp: string): { success: boolean, message: string, user?: User } => {
    const db = getDb();
    const storedOtpData = db.otpStore[email.toLowerCase()];

    if (!storedOtpData) {
        return { success: false, message: 'No OTP request found for this email. Please register again.' };
    }
    if (Date.now() > storedOtpData.expires) {
        delete db.otpStore[email.toLowerCase()];
        saveDb(db);
        return { success: false, message: 'Your OTP has expired. Please register again.' };
    }
    if (storedOtpData.otp !== otp) {
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // OTP is correct, find the user and verify them
    const userIndex = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
        return { success: false, message: 'Could not find user account to verify.' };
    }
    
    db.users[userIndex].isVerified = true;
    const verifiedUser = db.users[userIndex];
    delete db.otpStore[email.toLowerCase()];
    saveDb(db);

    return { success: true, message: 'Account verified successfully!', user: verifiedUser };
};


export const loginUser = (email: string, password: string): { success: boolean, message: string, user?: User } => {
    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid email or password.' };
    }

    if (!user.isVerified) {
        // Resend OTP logic could be added here
        return { success: false, message: 'Your account is not verified. Please check your email for the OTP.' };
    }

    return { success: true, message: 'Login successful!', user };
};

export const requestLoginOtp = (email: string): { success: boolean, message: string } => {
    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, message: 'No account found with this email.' };
    }
    if (!user.isVerified) {
        return { success: false, message: 'This account has not been verified yet.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    db.loginOtpStore[email.toLowerCase()] = {
        otp,
        expires: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    };
    saveDb(db);

    // Simulate sending OTP via email
    alert(`DEV ONLY: Your login OTP for ${email} is: ${otp}`);

    return { success: true, message: 'A login OTP has been sent to your email.' };
};

export const loginWithOtp = (email: string, otp: string): { success: boolean, message: string, user?: User } => {
    const db = getDb();
    const storedOtpData = db.loginOtpStore[email.toLowerCase()];

    if (!storedOtpData) {
        return { success: false, message: 'No login request found. Please request a new OTP.' };
    }
    if (Date.now() > storedOtpData.expires) {
        delete db.loginOtpStore[email.toLowerCase()];
        saveDb(db);
        return { success: false, message: 'Your OTP has expired. Please request a new one.' };
    }
    if (storedOtpData.otp !== otp) {
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
         return { success: false, message: 'Could not find user account.' };
    }
    
    delete db.loginOtpStore[email.toLowerCase()];
    saveDb(db);

    return { success: true, message: 'Login successful!', user };
};


export const getUserById = (userId: string): User | undefined => {
    const db = getDb();
    return db.users.find(u => u.id === userId);
}

export const updateUser = (updatedUser: User): {success: boolean, user?: User} => {
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === updatedUser.id);
    if (userIndex === -1) {
        return {success: false};
    }
    db.users[userIndex] = updatedUser;
    saveDb(db);
    return { success: true, user: updatedUser };
}

export const getTransactionsForUser = (userId: string): Payment[] => {
    const db = getDb();
    return db.transactions.filter(tx => tx.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const processPayment = (userId: string, courseId: string, amount: number, transactionId: string): Payment => {
    const db = getDb();
    const newPayment: Payment = {
        transactionId,
        userId,
        courseId,
        amount,
        timestamp: new Date().toISOString(),
    };
    db.transactions.push(newPayment);
    saveDb(db);
    return newPayment;
};

// --- Admin Functions ---
export const getAllUsers = (): User[] => {
    return getDb().users;
}

export const addUser = (userData: Omit<User, 'id' | 'enrolledCourses' | 'externalAccounts'>): { success: boolean, message: string, user?: User } => {
    const db = getDb();
    if (db.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
        ...userData,
        id: `${userData.role}_${Date.now()}`,
        enrolledCourses: [],
        externalAccounts: [],
    };
    db.users.push(newUser);
    saveDb(db);
    return { success: true, message: 'User added successfully', user: newUser };
};

export const deleteUser = (userId: string): { success: boolean, message: string } => {
    const db = getDb();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== userId);
    if (db.users.length < initialLength) {
        saveDb(db);
        return { success: true, message: 'User deleted successfully.' };
    }
    return { success: false, message: 'User not found.' };
}


// --- Content Management ---

export const getCourses = (filters: { searchTerm?: string, tag?: string, price?: 'all' | 'paid' | 'free' } = {}): Course[] => {
    let courses = getDb().courses;

    if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        courses = courses.filter(c => 
            c.title.toLowerCase().includes(term) || 
            c.description.toLowerCase().includes(term) ||
            c.instructor.toLowerCase().includes(term)
        );
    }
    
    if (filters.tag) {
        courses = courses.filter(c => c.tags.includes(filters.tag!));
    }
    
    if (filters.price && filters.price !== 'all') {
        courses = courses.filter(c => c.type === filters.price);
    }
    
    return courses;
};

export const getCourseById = (id: string): Course | undefined => {
    const db = getDb();
    return db.courses.find(c => c.id === id);
};


export const getCourseTags = (): string[] => {
    const courses = getDb().courses;
    const allTags = courses.flatMap(course => course.tags);
    // Filter out 'Free' as it's a type, not a category tag
    const categoryTags = allTags.filter(tag => tag.toLowerCase() !== 'free');
    return [...new Set(categoryTags)];
};


export const addCourse = (newCourseData: Omit<Course, 'id' | 'imageUrl' | 'modules' | 'downloads'>): Course => {
    const db = getDb();
    const newCourse: Course = {
        ...newCourseData,
        id: `c${db.courses.length + 1}_${Date.now()}`,
        imageUrl: `https://picsum.photos/seed/${newCourseData.title.split(' ')[0]}/600/400`,
        modules: [],
        downloads: [],
    };
    db.courses.unshift(newCourse);
    saveDb(db);
    return newCourse;
}

export const getResources = (): Resource[] => {
    return getDb().resources;
}

export const getDsaProblems = (): { category: string, problems: DSAProblem[] }[] => {
    return getDb().dsaProblems;
}

export const getLeaderboard = (): LeaderboardUser[] => {
    const db = getDb();
    const students = db.users.filter(u => u.role === 'student');
    
    const leaderboard = students.map(student => ({
        id: student.id,
        name: student.name,
        totalSolved: student.externalAccounts.reduce((sum, acc) => sum + acc.stats.solvedCount, 0)
    }));
    
    leaderboard.sort((a, b) => b.totalSolved - a.totalSolved);
    
    return leaderboard.map((user, index) => ({ ...user, rank: index + 1 }));
}