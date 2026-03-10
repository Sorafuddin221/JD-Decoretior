'use client';

import React from 'react';
import {
    AttachMoney,
    Dashboard as DashboardIcon,
    Inventory,
    People,
    ShoppingCart,
    Star
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    return (
        <div className="sidebar">
            <div className="logo">
                <DashboardIcon className='logo-icon' />
                Admin Dashboard
            </div>
            <nav className="nav-menu">
                <div className="nav-section">
                    <h3>Overview</h3>
                    <Link href="/admin/dashboard" className={isActive("/admin/dashboard") ? "active-link" : ""}>
                        <DashboardIcon className='nav-icon' />
                        Dashboard
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>Products</h3>
                    <Link href="/admin/products" className={isActive("/admin/products") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        All Products
                    </Link>
                    <Link href="/admin/product/create" className={isActive("/admin/product/create") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        Add New Product
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>Slides</h3>
                    <Link href="/admin/slides/all" className={isActive("/admin/slides/all") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        All Slides
                    </Link>
                    <Link href="/admin/slides/create" className={isActive("/admin/slides/create") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        Add New Slide
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>Offers</h3>
                    <Link href="/admin/offers/all" className={isActive("/admin/offers/all") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        All Special Offers
                    </Link>
                    <Link href="/admin/offers/create" className={isActive("/admin/offers/create") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        Add New Special Offer
                    </Link>
                    <Link href="/admin/offer-cards/all" className={isActive("/admin/offer-cards/all") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        All Offer Cards
                    </Link>
                    <Link href="/admin/offer-cards/create" className={isActive("/admin/offer-cards/create") ? "active-link" : ""}>
                        <Inventory className='nav-icon' />
                        Add New Offer Card
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>Orders</h3>
                    <Link href="/admin/orders" className={isActive("/admin/orders") ? "active-link" : ""}>
                        <ShoppingCart className='nav-icon' />
                        All Orders
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>Messages</h3>
                    <Link href="/admin/messages" className={isActive("/admin/messages") ? "active-link" : ""}>
                        <ShoppingCart className='nav-icon' />
                        Live Chat
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>Users & Reviews</h3>
                    <Link href="/admin/users" className={isActive("/admin/users") ? "active-link" : ""}>
                        <People className='nav-icon' />
                        All Users
                    </Link>
                    <Link href="/admin/reviews" className={isActive("/admin/reviews") ? "active-link" : ""}>
                        <Star className='nav-icon' />
                        All Reviews
                    </Link>
                </div>
                <div className="nav-section">
                    <h3>System</h3>
                    <Link href="/admin/navitems" className={isActive("/admin/navitems") ? "active-link" : ""}>
                        <DashboardIcon className='nav-icon' />
                        Manage Navigation
                    </Link>
                    <Link href="/admin/settings" className={isActive("/admin/settings") ? "active-link" : ""}>
                        <DashboardIcon className='nav-icon' />
                        General Settings
                    </Link>
                    <Link href="/admin/payments" className={isActive("/admin/payments") ? "active-link" : ""}>
                        <AttachMoney className='nav-icon' />
                        Payments
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default AdminSidebar;
