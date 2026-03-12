import React from 'react';
import PageTitle from '@/components/PageTitle';
import '../../pageStyles/PolicyStyles.css';

const PrivacyPolicy = () => {
    return (
        <>
            <PageTitle title="Privacy Policy - JIBON DECORETOR" />
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Privacy Policy</h1>
                    <p>আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ।</p>
                </header>

                <section className="policy-section">
                    <h3>১. তথ্য সংগ্রহ</h3>
                    <p>আপনার অর্ডার সম্পন্ন করতে এবং আপনার ঠিকানায় পণ্য পৌঁছে দিতে আমরা আপনার নাম, ফোন নম্বর এবং বর্তমান ঠিকানা সংগ্রহ করি।</p>
                </section>

                <section className="policy-section">
                    <h3>২. তথ্যের ব্যবহার</h3>
                    <p>আমরা কেবল অর্ডার ভেরিফিকেশন, পণ্য ডেলিভারি এবং আপনার সাথে যোগাযোগের প্রয়োজনে এই তথ্যগুলো ব্যবহার করি।</p>
                </section>

                <section className="policy-section">
                    <h3>৩. তথ্যের সুরক্ষা</h3>
                    <p>আপনার ব্যক্তিগত তথ্য অন্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না। আপনার গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার।</p>
                </section>

                <section className="policy-section">
                    <h3>৪. ডাইরেক্ট সাপোর্ট</h3>
                    <p>প্রয়োজনে আমরা আপনার ফোনে সরাসরি কল করে অর্ডারের তথ্য নিশ্চিত করব।</p>
                </section>
            </div>
        </>
    );
};

export default PrivacyPolicy;
