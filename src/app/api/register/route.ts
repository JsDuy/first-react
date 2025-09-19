import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data/users.json');

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, hash this!
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Read existing users
    let users: User[] = [];
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(data);
    }

    // Check if email exists
    if (users.find(user => user.email === email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Add new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password // TODO: Hash password in production (use bcrypt)
    };
    users.push(newUser);

    // Write back to JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: 'User registered successfully', user: { id: newUser.id, name, email } }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}