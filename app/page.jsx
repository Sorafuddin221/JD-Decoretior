import db from '@/lib/db';
import Slide from '@/models/slideModel';
import Settings from '@/models/settingsModel';

async function getSlides() {
  await db();
  const slides = await Slide.find({});
  return JSON.parse(JSON.stringify(slides));
}

async function getSettings() {
  await db();
  const settings = await Settings.findOne({});
  return JSON.parse(JSON.stringify(settings));
}

import React from 'react';
import InfoSection from '@/components/InfoSection';
import OfferSection from '@/components/OfferSection';
import HotDeals from '@/components/HotDeals';
import ImageSlider from '@/components/ImageSlider';
import Categories from '@/components/Categories';
import ProductTabs from '@/components/ProductTabs';
import TrendingProducts from '@/components/TrendingProducts';
import HomepageOfferAfterTopProducts from '@/components/HomepageOfferAfterTopProducts';
import SpecialOfferSection from '@/components/SpecialOfferSection';
import Notice from '@/components/Notice';
import '@/pageStyles/Home.css';

export default async function Home() {
  const initialSlides = await getSlides();
  const settings = await getSettings();

  return (
    <>
      <div className="hero-section-wrapper">
        <div className="main-slider-container">
          <ImageSlider initialSlides={initialSlides} />
        </div>
        <div className="special-offer-container">
          <SpecialOfferSection />
        </div>
      </div>
      <Notice text={settings?.noticeText} show={settings?.showNotice} />
      <Categories />
      <OfferSection />
      <HotDeals />
      <TrendingProducts />
      <HomepageOfferAfterTopProducts />
      <ProductTabs />
      <InfoSection />
    </>
  );
}
