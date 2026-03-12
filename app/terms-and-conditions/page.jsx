import React from 'react';
import PageTitle from '@/components/PageTitle';
import '../../pageStyles/PolicyStyles.css';

const TermsAndConditions = () => {
    return (
        <>
            <PageTitle title="Terms & Conditions - YaMart BD" />
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Terms and Conditions</h1>
                    <p>আমাদের সেবা ব্যবহারের আগে দয়া করে শর্তাবলীগুলো মনোযোগ দিয়ে পড়ুন।</p>
                </header>

                <section className="policy-section">
                    <h3>১. ভাড়া এবং বুকিং</h3>
                    <p>যেকোনো ডেকোরেশন আইটেম ভাড়ার জন্য নির্দিষ্ট পরিমাণ অগ্রিম (Advance) প্রদান করে বুকিং নিশ্চিত করতে হবে। অবশিষ্ট টাকা পণ্য হস্তান্তরের সময় বা আগে পরিশোধ করতে হবে।</p>
                </section>

                <section className="policy-section">
                    <h3>২. ভাড়ার সময়সীমা</h3>
                    <p>সাধারণত ডেকোরেশন সামগ্রী ২৪ ঘণ্টার জন্য ভাড়া দেওয়া হয়। অতিরিক্ত সময়ের জন্য অতিরিক্ত ফি প্রযোজ্য হবে যা আগে থেকেই আলোচনা করে নিতে হবে।</p>
                </section>

                <section className="policy-section">
                    <h3>৩. পণ্যের নিরাপত্তা ও দায়িত্ব</h3>
                    <p>পণ্য বুঝে নেওয়ার পর থেকে ফেরত দেওয়া পর্যন্ত এর নিরাপত্তার দায়িত্ব সম্পূর্ণ গ্রাহকের। পণ্য কোনোভাবে ক্ষতিগ্রস্ত হলে বা হারিয়ে গেলে গ্রাহককে তার বর্তমান বাজার মূল্য অথবা মেরামতের খরচ বহন করতে হবে।</p>
                </section>

                <section className="policy-section">
                    <h3>৪. সিকিউরিটি ডিপোজিট</h3>
                    <p>কিছু দামী সামগ্রীর ক্ষেত্রে আমরা নির্দিষ্ট পরিমাণ জামানত (Security Deposit) রাখতে পারি, যা পণ্য সঠিক অবস্থায় ফেরত পাওয়ার পর গ্রাহককে ফেরত দেওয়া হবে।</p>
                </section>

                <section className="policy-section">
                    <h3>৫. পরিবহন খরচ</h3>
                    <p>পণ্য আনা-নেওয়ার যাতায়াত খরচ (Delivery & Pickup Charge) গ্রাহককে বহন করতে হবে, যদি না বিশেষ কোনো অফার থাকে।</p>
                </section>
            </div>
        </>
    );
};

export default TermsAndConditions;
