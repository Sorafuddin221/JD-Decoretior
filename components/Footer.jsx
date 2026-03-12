'use client';
import React from 'react';
import {Phone,Mail, Facebook, LinkedIn, YouTube, Instagram} from '@mui/icons-material';
import '../componentStyles/Footer.css';
import Link from 'next/link';

function Footer({ settings }) {
  const phoneNumber = settings?.phoneNumber || "01516143874";
  const contactEmail = settings?.contactEmail || "yamartbd@gmail.com";
  return (
    <footer className='footer'>
      <div className="footer-container">
        {/*section 1*/}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><Phone fontSize='small'/> phone: {phoneNumber}</p>
          <p><Mail fontSize='small'/>Email: {contactEmail}</p>
        </div>
        {/*section 2*/}
        <div className="footer-section social">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a href="http://" target='_blank'>
            <Facebook className='social-icon'/>
            </a>
            <a href="http://" target='_blank'>
            <LinkedIn className='social-icon'/>
            </a>
            <a href="http://" target='_blank'>
            <YouTube className='social-icon'/>
            </a>
            <a href="http://" target='_blank'>
            <Instagram className='social-icon'/>
            </a>
          </div>
        </div>
        {/*section 3*/}
        <div className="footer-section footer-menu">
          <h3 className='footer-menu-title'>Footer Menu</h3>
          <ul className='footer-menu-items'>
            <li ><Link className='footer-menu-item' href="/about-us">About Us</Link></li>
            <li ><Link className='footer-menu-item' href="/support">How to Order</Link></li>
            <li ><Link className='footer-menu-item' href="/contact">Contact Us</Link></li>
            <li ><Link className='footer-menu-item' href="/privacy-policy">Privacy Policy</Link></li>
            <li ><Link className='footer-menu-item' href="/terms-and-conditions">Terms & Conditions</Link></li>
            <li ><Link className='footer-menu-item' href="/return-and-refund">Return and Refund</Link></li>
          </ul>
        </div>
        {/*section 4*/}
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>YaMart BD-তে আপনাকে স্বাগতম! আমরা আপনার বিশেষ দিনগুলোকে আরও রাঙিয়ে তুলতে সাশ্রয়ী মূল্যে সেরা মানের ডেকোরেশন সামগ্রী ভাড়া দিয়ে থাকি।</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>CopyRight &copy; 2026 YaMartBD all right reserved </p>
      </div>
    </footer>
  )
}

export default Footer;