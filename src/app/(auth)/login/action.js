'use server';
import { prisma } from '@/utils/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
export async function loginAction(_, formData) {
  const cookieStore = await cookies();

  const email = formData.get('email');
  const password = formData.get('password');

  let fieldsError = {};
  fieldsError.emailValue = email;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      fieldsError.error = 'Invalid credentials';
      return {
        success: false,
        fieldsError,
      };
    }

    if (user.password === null) {
      fieldsError.error =
        'Email already registered with google, please continue with google';
      return {
        success: false,
        fieldsError,
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      fieldsError.error = 'Invalid credentials';
      return {
        success: false,
        fieldsError,
      };
    }

    const newSession = await prisma.session.create({
      data: {
        userId: user.id,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    cookieStore.set('sessionId', newSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: true,
    });

    return {
      success: true,
      message: 'Sheesssh',
    };
  } catch (error) {
    console.error('error login page', error);
    fieldsError.error = 'There is a problem on our end, please try again later';
    return {
      success: false,
      fieldsError,
    };
  }
}
