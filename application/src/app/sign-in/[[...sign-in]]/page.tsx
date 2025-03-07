import { ClerkProvider, SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <ClerkProvider>
      <div className="flex justify-center items-center">
        <SignIn
          routing="path"
          path="/sign-in"
          forceRedirectUrl={'/get-started'}
          redirectUrl={'/get-started'}
        />
      </div>
    </ClerkProvider>
  );
}
