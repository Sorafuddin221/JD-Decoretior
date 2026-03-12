import React from 'react';
import PageTitle from '@/components/PageTitle';
import './AboutUs.css'; // Import a new CSS file for styling

function AboutUs() {
  return (
    <>
      <PageTitle title="About Us - My E-Shop" />
      <div className="about-us-container">
        <section className="about-us-section">
          <h1>Our Story</h1>
          <p>
            Welcome to My JIBON DECORETOR Family! We started this journey with a simple mission: to provide high-quality products that bring joy and convenience to your daily life. What began as a small passion project has grown into a thriving online store, serving customers with a diverse range of products that are carefully curated for their quality and value.
          </p>
        </section>

        <section className="about-us-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to create a seamless and enjoyable shopping experience for our customers. We are committed to offering exceptional products at competitive prices, backed by outstanding customer service. We believe in building lasting relationships with our customers and strive to exceed their expectations at every turn.
          </p>
        </section>

        <section className="about-us-section">
          <h2>What We Offer</h2>
          <p>
            At My E-Shop, you'll find a wide selection of products across various categories. From the latest electronics to trendy fashion, home essentials, and more, we have something for everyone. Our team is constantly searching for new and exciting products to add to our collection, so there's always something new to discover.
          </p>
        </section>

        <section className="about-us-section">
          <h2>Our Commitment to Quality</h2>
          <p>
            We take pride in the quality of our products. Every item in our store is carefully selected and tested to ensure it meets our high standards. We partner with trusted suppliers and manufacturers to bring you products that are not only stylish and functional but also durable and reliable.
          </p>
        </section>

        <section className="about-us-section">
          <h2>Why Choose Us?</h2>
          <ul>
            <li><strong>Wide Selection:</strong> A diverse range of products to suit your needs.</li>
            <li><strong>Quality Assurance:</strong> High-quality products you can trust.</li>
            <li><strong>Competitive Prices:</strong> Great value for your money.</li>
            <li><strong>Excellent Customer Service:</strong> A dedicated team ready to assist you.</li>
            <li><strong>Fast and Reliable Shipping:</strong> Get your orders delivered to your doorstep quickly and securely.</li>
          </ul>
        </section>

        <section className="about-us-section">
          <h2>Connect with Us</h2>
          <p>
            We love to hear from our customers! Follow us on our social media channels to stay updated on our latest products, promotions, and news. Join our community and be a part of the My JIBON DECORETOR family.
          </p>
          <div className="social-links">
           
            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutUs;
