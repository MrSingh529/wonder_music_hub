
'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface GradientCoverProps {
  title: string;
}

// Simple hash function to generate a number from a string
function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Function to generate two colors based on the hash
function getColorsFromHash(hash: number) {
  const h = Math.abs(hash % 360);
  const s1 = 50 + Math.abs((hash >> 8) % 50);
  const l1 = 40 + Math.abs((hash >> 16) % 30);
  
  const h2 = (h + 120) % 360;
  const s2 = 50 + Math.abs((hash >> 24) % 50);
  const l2 = 50 + Math.abs((hash >> 4) % 30);

  return [`hsl(${h}, ${s1}%, ${l1}%)`, `hsl(${h2}, ${s2}%, ${l2}%)`];
}

export function GradientCover({ title }: GradientCoverProps) {
  const [gradient, setGradient] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const hash = simpleHash(title);
      const [color1, color2] = getColorsFromHash(hash);
      setGradient(`linear-gradient(to right, ${color1}, ${color2})`);
    } catch (error) {
      console.error('Failed to generate gradient:', error);
      // Fallback gradient
      setGradient('linear-gradient(to right, #e0e0e0, #f0f0f0)');
    } finally {
      setLoading(false);
    }
  }, [title]);

  if (loading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div
      className="h-full w-full rounded-md"
      style={{ background: gradient }}
    />
  );
}
