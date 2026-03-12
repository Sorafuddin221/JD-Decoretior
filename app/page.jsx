import db from '@/lib/db';
import Slide from '@/models/slideModel';

async function getSlides() {
  await db();
  const slides = await Slide.find({});
  return JSON.parse(JSON.stringify(slides));
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
import '@/pageStyles/Home.css';

export default async function Home() {
  const initialSlides = await getSlides();

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
