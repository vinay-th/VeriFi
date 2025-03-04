import { ClerkProvider, SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <ClerkProvider>
      <div className="flex justify-center items-center">
        <SignUp
          routing="path"
          path="/sign-up"
          forceRedirectUrl={'/get-started'}
          redirectUrl={'/get-started'}
        />
      </div>
    </ClerkProvider>
  );
}
