import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Slide from '@/models/slideModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const POST = handleAsyncError(async (request) => {
  await db();
  const body = await request.json(); // Use request.json()
  const { imageUrl, buttonUrl } = body;

  if (!imageUrl) {
    return NextResponse.json({ success: false, message: 'Please provide an image URL.' }, { status: 400 });
  }

  const newSlide = new Slide({
    imageUrl,
    buttonUrl,
  });

  await newSlide.save();
  // db.disconnect() is not typically called here in Next.js API routes due to connection caching
  // and potential for multiple requests using the same connection within a short period.

  return NextResponse.json({ success: true, message: 'The slide has been successfully created.', slide: newSlide }, { status: 201 });
});

export const GET = handleAsyncError(async () => {
  await db();
  const slides = await Slide.find({});
  // db.disconnect() is not typically called here
  return NextResponse.json(slides);
});