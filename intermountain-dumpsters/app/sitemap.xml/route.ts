import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('HELLO SITEMAP', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 