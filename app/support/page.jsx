import React from 'react';
import PageTitle from '@/components/PageTitle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import '../../pageStyles/Support.css';

const SupportPage = () => {
    return (
        <>
            <PageTitle title="How to Order - JIBON DECORETOR" />
            <div className="support-container">
                <header className="support-header">
                    <h1>How to Order - কিভাবে অর্ডার করবেন</h1>
                    <p>আপনার ডেকোরেশন শপিং আরও সহজ করার জন্য নিচের ধাপগুলো অনুসরণ করুন।</p>
                </header>

                <section className="how-to-order-section">
                    <div className="order-steps">
                        <div className="step-item">
                            <div className="step-number">১</div>
                            <div className="step-icon-wrapper">
                                <PersonAddIcon fontSize="large" style={{ color: '#e67e22' }} />
                            </div>
                            <div className="step-content">
                                <h3>Create Your Account / অ্যাকাউন্ট তৈরি করুন</h3>
                                <p>উপরের "Register" বাটনে ক্লিক করে আপনার নাম, ইমেইল এবং পাসওয়ার্ড দিয়ে একটি অ্যাকাউন্ট তৈরি করুন। এটি আপনার অর্ডার ট্র্যাক করতে সাহায্য করবে।</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">২</div>
                            <div className="step-icon-wrapper">
                                <SearchIcon fontSize="large" style={{ color: '#e67e22' }} />
                            </div>
                            <div className="step-content">
                                <h3>Browse & Choose / পণ্য পছন্দ করুন</h3>
                                <p>আমাদের বিভিন্ন ক্যাটাগরি থেকে আপনার পছন্দের ডেকোরেশন আইটেমটি খুঁজে বের করুন। পণ্যের বিস্তারিত জানতে ছবির উপর ক্লিক করুন।</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">৩</div>
                            <div className="step-content">
                                <div className="step-icon-wrapper">
                                    <AddShoppingCartIcon fontSize="large" style={{ color: '#e67e22' }} />
                                </div>
                                <h3>Add to Cart / কার্টে যোগ করুন</h3>
                                <p>পছন্দের পণ্যটি নির্বাচন করে "Add to Cart" বাটনে ক্লিক করুন। আপনি চাইলে একসাথে একাধিক পণ্য যোগ করতে পারেন।</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">৪</div>
                            <div className="step-icon-wrapper">
                                <ShoppingBagIcon fontSize="large" style={{ color: '#e67e22' }} />
                            </div>
                            <div className="step-content">
                                <h3>Checkout / চেকআউট করুন</h3>
                                <p>কার্ট আইকনে ক্লিক করে আপনার অর্ডারটি যাচাই করুন এবং "Proceed to Checkout" এ ক্লিক করুন। আপনার সঠিক ঠিকানা এবং ফোন নম্বর দিন।</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">৫</div>
                            <div className="step-icon-wrapper">
                                <CheckCircleOutlineIcon fontSize="large" style={{ color: '#e67e22' }} />
                            </div>
                            <div className="step-content">
                                <h3>Confirm Order / অর্ডার নিশ্চিত করুন</h3>
                                <p>পেমেন্ট মেথড হিসেবে <strong>Cash on Delivery</strong> অথবা <strong>bKash/Mobile Banking</strong> সিলেক্ট করে অর্ডারটি কনফার্ম করুন। আমরা আপনার সাথে ফোনে যোগাযোগ করে অর্ডারটি ভেরিফাই করব।</p>
                            </div>
                        </div>
                        </div>
                        </section>

                        <section className="contact-support-box">
                        <h3>অর্ডার করতে কোনো সমস্যা হচ্ছে?</h3>
                        <p>আপনার যদি অনলাইনে অর্ডার করতে কষ্ট হয়, তবে সরাসরি আমাদের হোয়াটসঅ্যাপে মেসেজ দিন। আমরা ম্যানুয়ালি আপনার অর্ডারটি গ্রহণ করব।</p>
                        <a href="https://wa.me/8801516143874" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                        <WhatsAppIcon /> সরাসরি WhatsApp এ কথা বলুন
                        </a>
                        </section>

                        <section className="faq-section">
                        <h2>সচরাচর জিজ্ঞাসা (FAQ)</h2>
                        <div className="faq-item">
                        <h4>পেমেন্ট করার নিয়ম কি?</h4>
                        <p>আপনি চাইলে পণ্য হাতে পেয়ে টাকা পরিশোধ করতে পারেন (Cash on Delivery)। এছাড়া বিকাশ বা অন্যান্য মোবাইল ব্যাংকিংয়ের মাধ্যমেও পেমেন্ট করা সম্ভব।</p>
                        </div>
        
                </section>
            </div>
        </>
    );
};

export default SupportPage;
