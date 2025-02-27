import { currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  const user = await currentUser();
  const role = user?.publicMetadata.role;

  if (!user) return <div>Not signed in</div>;

  return <div>Hello {role as string}</div>;
}
