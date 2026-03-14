'use client';

import React, { useState, useEffect } from 'react';
import '@/CartStyles/Shipping.css';
import PageTitle from '@/components/PageTitle';
import CheckoutPath from '@/Cart/CheckoutPath';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { data as bdData } from '@/Cart/bd-states-cities';
import { toast } from 'react-toastify';
import { saveShippingInfo } from '@/features/cart/cartSlice';

function ShippingPage() {
    const { shippingInfo } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();

    const [address, setAddress] = useState(shippingInfo.address || "");
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
    const [phoneNumber, setPhoneNumber] = useState(shippingInfo.phoneNumber || "");
    const [country, setCountry] = useState(shippingInfo.country || "BD"); // Default to Bangladesh
    const [state, setState] = useState(shippingInfo.state || "");
    const [city, setCity] = useState(shippingInfo.city || "");
    const [thana, setThana] = useState(shippingInfo.thana || ""); // New thana state

    const [paymentSettings, setPaymentSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Error states for validation
    const [addressError, setAddressError] = useState(false);
    const [pinCodeError, setPinCodeError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [stateError, setStateError] = useState(false);
    const [cityError, setCityError] = useState(false);

    const [isDivisionDisabled, setIsDivisionDisabled] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/payment-settings', { cache: 'no-store' });
                const data = await res.json();
                setPaymentSettings(data);
                
                // If only one division exists, pre-select it
                if (data.activeDivisions?.length === 1) setState(data.activeDivisions[0]);
                // If only one district exists, pre-select it
                if (data.activeDistricts?.length === 1) setCity(data.activeDistricts[0]);
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoadingSettings(false);
            }
        };
        fetchSettings();
    }, []);

    const shippingInfoSubmit = (e) => {
        e.preventDefault();

        let isValid = true;

        // Reset all errors
        setAddressError(false);
        setPinCodeError(false);
        setPhoneNumberError(false);
        setStateError(false);
        setCityError(false);

        if (!address.trim()) {
            setAddressError(true);
            toast.error('Please enter your shipping address.', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }
        if (!pinCode.trim()) {
            setPinCodeError(true);
            toast.error('Please enter your pincode.', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }
        if (!phoneNumber.trim()) {
            setPhoneNumberError(true);
            toast.error('Please enter your phone number.', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        } else if (phoneNumber.length !== 11) {
            setPhoneNumberError(true);
            toast.error('Please enter a valid 11-digit phone number.', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }

        if (!state.trim()) {
            setStateError(true);
            toast.error('Please select your division.', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        } else if (state && !city.trim()) {
            setCityError(true);
            toast.error('Please select your district.', { position: 'top-center', autoClose: 3000 });
            isValid = false;
        }

        if (isValid) {
            dispatch(saveShippingInfo({ 
                address, 
                pinCode, 
                state, 
                city, 
                thana,
                country, 
                phoneNumber, 
                shippingMethod: shippingInfo.shippingMethod 
            }));
            router.push('/order/confirm');
        }
    };

    return (
        <>
            <PageTitle title="Shipping Info" />
            <CheckoutPath activePath={0} />
            <div className="shipping-form-container">
                <h1 className='shipping-form-header'>Shipping Details</h1>
                <form className='shipping-form' onSubmit={shippingInfoSubmit}>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                onFocus={() => setAddressError(false)}
                                onBlur={(e) => setAddressError(!e.target.value.trim())}
                                placeholder='Enter Your address'
                                name="address"
                                id="address"
                                className={addressError ? 'error-field' : ''}
                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="pinCode">Pincode</label>
                            <input
                                type="number"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                onFocus={() => setPinCodeError(false)}
                                onBlur={(e) => setPinCodeError(!e.target.value.trim())}
                                placeholder='Enter Your pincode'
                                name="pinCode"
                                id="pinCode"
                                className={pinCodeError ? 'error-field' : ''}
                            />
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                onFocus={() => setPhoneNumberError(false)}
                                onBlur={(e) => {
                                    if (!e.target.value.trim() || e.target.value.length !== 11) {
                                        setPhoneNumberError(true);
                                    }
                                }}
                                placeholder='Enter Your Phone Number'
                                name="phoneNumber"
                                id="phoneNumber"
                                className={phoneNumberError ? 'error-field' : ''}
                            />
                        </div>
                    </div>
                    <div className="shipping-section">
                        <div className="shipping-form-group">
                            <label htmlFor="country">Country</label>
                            <select
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setState("");
                                    setCity("");
                                }}
                                id="country"
                                name="country"
                                disabled
                                className={country ? '' : 'error-field'} // Country should always be selected
                            >
                                <option value="BD">Bangladesh</option>
                            </select>
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="state">Division</label>
                            <select
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                id="state"
                                name="state"
                                required
                            >
                                <option value="">Select Division</option>
                                {paymentSettings?.activeDivisions?.map((div) => (
                                    <option value={div} key={div}>{div}</option>
                                ))}
                            </select>
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="city">District</label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                id="city"
                                name="city"
                                required
                            >
                                <option value="">Select District</option>
                                {paymentSettings?.activeDistricts?.map((dist) => (
                                    <option value={dist} key={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>
                        <div className="shipping-form-group">
                            <label htmlFor="thana">Thana / Area</label>
                            <select
                                value={thana}
                                onChange={(e) => {
                                    setThana(e.target.value);
                                }}
                                id="thana"
                                name="thana"
                                required
                            >
                                <option value="">Select Thana/Area</option>
                                {paymentSettings?.shippingZones?.map((zone) => (
                                    <option value={zone.name} key={zone.name}>{zone.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button className="shipping-submit-btn">Continue</button>
                </form>
            </div>
        </>
    );
}

export default ShippingPage;