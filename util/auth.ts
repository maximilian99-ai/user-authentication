import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_STORAGE_KEY = '@auth_users';
const TOKEN_STORAGE_KEY = '@auth_token';

interface User {
  email: string;
  password: string;
}

async function getStoredUsers(): Promise<User[]> {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to get stored users:', error);
    return [];
  }
}

async function storeUser(email: string, password: string): Promise<void> {
  try {
    const users = await getStoredUsers();
    users.push({ email, password });
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to store user:', error);
    throw new Error('Failed to store user information.');
  }
}

async function authenticate(mode: 'signUp' | 'signIn', email: string, password: string): Promise<string> {
  if (!email || !password) {
    throw new Error('Input email and password.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const users = await getStoredUsers();

  if (mode === 'signUp') {
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Email already exists.');
    }
    await storeUser(email, password);
  } else {
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      throw new Error('Not valid email and password.');
    }
  }

  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  return token;
}

export function createUser(email: string, password: string): Promise<string> {
  return authenticate('signUp', email, password);
}

export function login(email: string, password: string): Promise<string> {
  return authenticate('signIn', email, password);
}