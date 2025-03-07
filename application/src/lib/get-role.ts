import { currentUser } from '@clerk/nextjs/server';

const getRole = async () => {
  const user = await currentUser();

  const role = user?.publicMetadata.role;

  console.log(role);

  return role;
};

export default getRole;
