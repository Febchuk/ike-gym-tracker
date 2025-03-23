import prisma from '@/app/lib/prisma';
import { hash } from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate Input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({ data: { name, email, passwordHash } });

    return NextResponse.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    console.error('Registration error: ', error);
    return NextResponse.json({ error: 'An unexpected error occured' }, { status: 500 });
  }
}
