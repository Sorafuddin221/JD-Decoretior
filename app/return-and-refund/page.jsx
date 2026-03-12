import React from 'react';
import PageTitle from '@/components/PageTitle';
import '../../pageStyles/PolicyStyles.css';

const ReturnAndRefund = () => {
    return (
        <>
            <PageTitle title="Return & Refund - YaMart BD" />
            <div className="policy-container">
                <header className="policy-header">
                    <h1>Return & Refund Policy</h1>
                    <p>পণ্য গ্রহণ এবং ভাড়ার সময়সীমা শেষ হওয়ার পর ফেরত দেওয়ার নিয়মাবলী নিচে দেওয়া হলো।</p>
                </header>

                <section className="policy-section">
                    <h3>১. বুকিং ক্যানসেলেশন ও রিফান্ড</h3>
                    <p>অনুষ্ঠানের ৩ দিন আগে বুকিং বাতিল করলে অগ্রিম পরিশোধ করা টাকার ৫০% ফেরত পাবেন। অনুষ্ঠানের ১ দিন বা তার কম সময় আগে বাতিল করলে কোনো রিফান্ড প্রযোজ্য হবে না।</p>
                </section>

                <section className="policy-section">
                    <h3>২. পণ্য ফেরত (Return Procedure)</h3>
                    <p>ভাড়ার সময়সীমা শেষ হওয়ার সাথে সাথে পণ্য ফেরত দিতে হবে। পণ্য ফেরত নেওয়ার সময় আমাদের প্রতিনিধি প্রতিটি আইটেম চেক করে বুঝে নেবেন।</p>
                </section>

                <section className="policy-section">
                    <h3>৩. ক্ষতিপূরণ ও জরিমানা</h3>
                    <p>পণ্য যদি ক্ষতিগ্রস্ত (broken) বা অকেজো অবস্থায় ফেরত পাওয়া যায়, তবে গ্রাহককে তার নির্ধারিত ক্ষতিপূরণ বা বর্তমান বাজার মূল্য প্রদান করতে হবে।</p>
                </section>

                <section className="policy-section">
                    <h3>৪. ভুল পণ্য সরবরাহ</h3>
                    <p>যদি আমাদের পক্ষ থেকে কোনো ভুল পণ্য সরবরাহ করা হয়, তবে অবিলম্বে জানালে আমরা তা দ্রুত পরিবর্তন করে দেব অথবা ওই আইটেমের ভাড়া রিফান্ড করব।</p>
                </section>

                <section className="policy-section">
                    <h3>৫. সিকিউরিটি মানি ফেরত</h3>
                    <p>পণ্য সঠিক ও অক্ষত অবস্থায় ফেরত পাওয়ার পর সাথে সাথেই জামানত বা সিকিউরিটি মানি ফেরত দেওয়া হবে।</p>
                </section>
            </div>
        </>
    );
};

export default ReturnAndRefund;
