import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Settings from '@/models/settingsModel';
import { verifyUserAuth } from '@/middleware/auth';
import handleAsyncError from '@/middleware/handleAsyncError';
import { revalidatePath } from 'next/cache';

// Get settings
export const GET = handleAsyncError(async () => {
  await db();
  const settings = await Settings.findOne({});
  console.log("FETCHED SETTINGS FROM DB:", settings);
  return NextResponse.json(settings || {});
});

// Update settings
export const POST = handleAsyncError(async (req) => {
  const { user, isAuthenticated } = await verifyUserAuth(req);
  if (!isAuthenticated || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { siteTitle, siteLogoUrl, siteFaviconUrl, textIcon, phoneNumber, contactEmail } = body;
  console.log("RECEIVED SETTINGS TO SAVE:", body);

  await db();
  let settings = await Settings.findOne({});
  
  if (!settings) {
    console.log("CREATING NEW SETTINGS DOCUMENT");
    settings = new Settings({
      siteTitle,
      siteLogoUrl,
      siteFaviconUrl,
      textIcon,
      phoneNumber,
      contactEmail,
    });
  } else {
    console.log("UPDATING EXISTING SETTINGS DOCUMENT ID:", settings._id);
    settings.siteTitle = siteTitle;
    settings.siteLogoUrl = siteLogoUrl;
    settings.siteFaviconUrl = siteFaviconUrl;
    settings.textIcon = textIcon;
    settings.phoneNumber = phoneNumber;
    settings.contactEmail = contactEmail;
  }

  const savedSettings = await settings.save();
  console.log("SAVED SETTINGS IN DB:", savedSettings);
  
  revalidatePath('/');
  revalidatePath('/admin/settings');
  
  return NextResponse.json({ message: 'Settings updated successfully', settings: savedSettings });
});
