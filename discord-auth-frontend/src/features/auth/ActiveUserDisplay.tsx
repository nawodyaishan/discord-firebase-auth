import useCurrentUser from '@/hooks/use-current-user.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ActiveUserDisplay() {
  const { authUser, user, authUserLoading, userLoading, userError, authUserError } =
    useCurrentUser();

  if (authUserLoading || userLoading) {
    return <div>Loading user information...</div>;
  }

  if (authUserError || userError) {
    return <div>Error: {authUserError?.message || userError?.message}</div>;
  }

  if (!authUser) {
    return <div>No user logged in</div>;
  }

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle>Active User Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 space-y-2">
            <CardDescription>Email: {authUser.email}</CardDescription>
            {user && <CardDescription>Name: {user.id}</CardDescription>}
            {user && <CardDescription>Role: {user.email}</CardDescription>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActiveUserDisplay;
