import SessionTimeout from '../components/SessionTimeout';
import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";
import LayoutClient from "../components/LayoutClient"; // Import LayoutClient
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/settings`,{
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch settings');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      siteTitle: "JIBON DECORETOR",
      siteLogoUrl: "",
      siteFaviconUrl: "",
      textIcon: "",
      phoneNumber: "01516143874",
      contactEmail: "jibondecoretor@gmail.com",
    };
  }
}

export async function generateMetadata() {
  const settings = await getSettings();
  const description = "An e-commerce application built with Next.js and Redux.";
  const siteTitle = settings.siteTitle;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL),
    title: {
      template: `%s | ${siteTitle}`,
      default: siteTitle,
    },
    description: description,
    keywords: ['e-commerce', 'Next.js', 'Redux', 'online shopping'],
    icons: {
      icon: settings.siteFaviconUrl || "/favicon.ico",
      shortcut: settings.siteFaviconUrl || "/favicon.ico",
      apple: settings.siteFaviconUrl || "/apple-touch-icon.png",
      other: [
        { rel: 'apple-touch-icon-precomposed', url: settings.siteFaviconUrl || '/apple-touch-icon-precomposed.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', url: settings.siteFaviconUrl || '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: settings.siteFaviconUrl || '/favicon-32x32.png' },
      ],
    },
    openGraph: {
        title: siteTitle,
        description: description,
        url: process.env.NEXT_PUBLIC_FRONTEND_URL,
        siteName: siteTitle,
        images: [
            {
                url: settings.siteLogoUrl || '/og-image.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: description,
        images: [settings.siteLogoUrl || '/twitter-image.png'],
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
      </head>
      <body>
        <ReduxProvider>
          <SessionTimeout />
          <LayoutClient settings={settings}>{children}</LayoutClient>
          <ToastContainer />
        </ReduxProvider>
        <div id="portal-root"></div>
      </body>
    </html>
  );
}