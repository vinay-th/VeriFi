'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../public/Logo.png';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { ClerkProvider, UserButton } from '@clerk/nextjs';

export function NavigationMenuDemo() {
  return (
    <div className="relative flex pt-3 items-center justify-between w-full px-10">
      <div className="flex items-center gap-2">
        <Link href="/" legacyBehavior passHref>
          <Image src={Logo} alt="Logo" className="h-10 w-10" />
        </Link>
        <span className="text-white text-3xl font-Instrument_Sans font-normal ">
          VeriFi
        </span>
      </div>

      {/* Center - Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6 pt-[0.81rem] pb-[0.81rem]">
            <NavigationMenuItem>
              <NavigationMenuLink href="#about" className="bg-transparent">
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#components" className="bg-transparent">
                Products
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className="bg-transparent">
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div>
        <ClerkProvider>
          <UserButton />
        </ClerkProvider>
      </div>
    </div>
  );
}
