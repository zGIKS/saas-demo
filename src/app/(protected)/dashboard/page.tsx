'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardPage() {
  const { isLoading, logout, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner aria-label="Loading dashboard" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You are not authenticated. Please sign in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Asphanyx Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Hello! You are successfully authenticated.</p>
            <Button onClick={() => logout()} variant="outline">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}