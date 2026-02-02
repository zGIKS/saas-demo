import { NextRequest } from 'next/server';
import { AuthController } from '@/services/iam/controller/auth.controller';

export async function POST(request: NextRequest) {
  return AuthController.signUp(request);
}