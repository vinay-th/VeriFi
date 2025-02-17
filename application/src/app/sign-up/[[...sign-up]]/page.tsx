import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}
