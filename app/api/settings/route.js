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
  return NextResponse.json(settings || {});
});

// Update settings
export const POST = handleAsyncError(async (req) => {
  const { user, isAuthenticated } = await verifyUserAuth(req);
  if (!isAuthenticated || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { siteTitle, siteLogoUrl, siteFaviconUrl, textIcon, phoneNumber, contactEmail, noticeText, showNotice } = body;

  await db();
  let settings = await Settings.findOne({});
  
  if (!settings) {
    settings = new Settings({
      siteTitle,
      siteLogoUrl,
      siteFaviconUrl,
      textIcon,
      phoneNumber,
      contactEmail,
      noticeText,
      showNotice,
    });
  } else {
    settings.siteTitle = siteTitle;
    settings.siteLogoUrl = siteLogoUrl;
    settings.siteFaviconUrl = siteFaviconUrl;
    settings.textIcon = textIcon;
    settings.phoneNumber = phoneNumber;
    settings.contactEmail = contactEmail;
    settings.noticeText = noticeText;
    settings.showNotice = showNotice;
  }

  const savedSettings = await settings.save();
  
  revalidatePath('/');
  revalidatePath('/admin/settings');
  
  return NextResponse.json({ message: 'Settings updated successfully', settings: savedSettings });
});
