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

const defaultGreeting = {
  text: 'Welcome',
  icon: <LuSun size={20} />,
};

const Greeting = () => {
  const [greeting, setGreeting] = useState(defaultGreeting);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateGreeting = () => {
      const date = new Date();
      const hours = date.getHours();
      setGreeting(getGreetingAndIcon(hours));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // During SSR and initial client render, show default greeting
  if (!isClient) {
    return (
      <h1 className="text-base font-Rubik text-[#6A5AE0] font-semibold leading-5 tracking-wider flex flex-row items-center gap-1">
        {defaultGreeting.icon}
        {defaultGreeting.text}
      </h1>
    );
  }

  return (
    <h1 className="text-base font-Rubik text-[#6A5AE0] font-semibold leading-5 tracking-wider flex flex-row items-center gap-1">
      {greeting.icon}
      {greeting.text}
    </h1>
  );
};

export default Greeting;
