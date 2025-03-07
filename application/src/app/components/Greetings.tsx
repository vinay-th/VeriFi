'use client';

import { useEffect, useState } from 'react';
import { LuSun, LuMoon, LuSunrise, LuSunset } from 'react-icons/lu';

const getGreetingAndIcon = (hours: number) => {
  if (hours >= 5 && hours < 12)
    return { text: 'Good Morning', icon: <LuSunrise size={20} /> };
  if (hours >= 12 && hours < 18)
    return { text: 'Good Afternoon', icon: <LuSun size={20} /> };
  if (hours >= 18 && hours < 21)
    return { text: 'Good Evening', icon: <LuSunset size={20} /> };
  return { text: 'Good Night', icon: <LuMoon size={20} /> };
};

const Greeting = () => {
  const [greeting, setGreeting] = useState({
    text: '',
    icon: <LuSun size={20} />,
  });

  useEffect(() => {
    const date = new Date();
    const localTime = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(date);

    setGreeting(getGreetingAndIcon(Number(localTime)));
  }, []);

  return (
    <h1 className="text-base font-Rubik text-[#6A5AE0] font-semibold leading-5 tracking-wider flex flex-row items-center gap-1">
      {greeting.icon}
      {greeting.text}
    </h1>
  );
};

export default Greeting;
