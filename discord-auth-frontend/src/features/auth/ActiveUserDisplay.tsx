import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useCurrentUser from '@/hooks/use-current-user.ts';
import { AuthHelpers } from '@/helpers/auth-helpers.ts';

function ActiveUserDisplay() {
  const { authUser, user, authUserLoading, userLoading, userError, authUserError } =
    useCurrentUser();

  if (authUserLoading || userLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Loading user information...</p>
      </div>
    );
  }

  if (authUserError || userError) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">Error: {authUserError?.message || userError?.message}</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="text-center py-4">
        <p className="text-yellow-600">No user logged in</p>
      </div>
    );
  }

  const authMethods = authUser.providerData
    .map((provider) => AuthHelpers.getProviderName(provider.providerId))
    .join(', ');

  return (
    <Card className="w-full max-w-md bg-white shadow-md">
      <CardHeader>
        <CardTitle>Active User Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 space-y-2">
            <CardDescription>
              <span className="font-bold">Email:</span> {authUser.email}
            </CardDescription>
            {user && (
              <CardDescription>
                <span className="font-bold">Name:</span> {authUser.displayName || user.uid}
              </CardDescription>
            )}
            <CardDescription>
              <span className="font-bold">Authentication Methods:</span> {authMethods}
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActiveUserDisplay;
