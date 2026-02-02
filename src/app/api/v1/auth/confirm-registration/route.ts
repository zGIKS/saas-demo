import { NextRequest } from 'next/server';
import { AuthController } from '@/services/iam/controller/auth.controller';

export async function GET(request: NextRequest) {
  return AuthController.confirmRegistration(request);
}