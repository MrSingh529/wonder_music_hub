'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  Home, 
  Music, 
  ListMusic, 
  CalendarClock, 
  PlusCircle, 
  LogOut 
} from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAuth, signOut } from "firebase/auth";
import { Button } from "../ui/button";
import { app } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    // Clear the session cookie by calling our own API route
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      <SidebarHeader>
        <h2 className="text-xl font-semibold font-headline">Harmony Hub Admin</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/admin'}>
              <Link href="/admin"><Home />Dashboard</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/tracks')}>
              <Link href="/admin/tracks"><Music />Manage Tracks</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname.startsWith('/admin/coming-soon')}>
              <Link href="/admin/coming-soon"><CalendarClock />Manage Upcoming</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start gap-2">
            <LogOut />
            Sign Out
         </Button>
      </SidebarFooter>
    </>
  );
}
