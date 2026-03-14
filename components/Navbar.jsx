import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getAllCategories } from "../features/category/categorySlice";
import { logout } from '@/features/user/userSlice';
import UserDashboard from './UserDashboard';
import Loader from './Loader';
import '../componentStyles/Navbar.css'; // Changed to Navbar.css
import axios from 'axios'; // Import axios for API calls

const Navbar = ({ settings }) => {
    const siteLogoUrl = settings?.siteLogoUrl;
    const phoneNumber = settings?.phoneNumber || "01516143874";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAllCatOpen, setIsAllCatOpen] = useState(false);
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [isMyDashboardDropdownOpen, setIsMyDashboardDropdownOpen] = useState(false);
    const [isMyDashboardMobileOpen, setIsMyDashboardMobileOpen] = useState(false);
    const [isCurrencyMobileOpen, setIsCurrencyMobileOpen] = useState(false);
    const [isLanguageMobileOpen, setIsLanguageMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [topHeaderVisible, setTopHeaderVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    const dispatch = useDispatch();
    const { categories: reduxCategories, error, loading: categoriesLoading } = useSelector((state) => state.category || {});
    const { isAuthenticated, user, loading } = useSelector(state => state.user || {});
    const { cartItems } = useSelector(state => state.cart || { cartItems: [] });

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // New state for mobile search
    const [isCartAnimating, setIsCartAnimating] = useState(false);
    const prevCartLength = useRef(cartItems ? cartItems.length : 0);

    useEffect(() => {
        if (cartItems && cartItems.length > prevCartLength.current) {
            setIsCartAnimating(true);
            const timer = setTimeout(() => {
                setIsCartAnimating(false);
            }, 500); // Duration of the animation
            return () => clearTimeout(timer);
        }
        prevCartLength.current = cartItems ? cartItems.length : 0;
    }, [cartItems]);

    const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

    // New states for search suggestions
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);


    const languageDropdownRef = useRef(null);
    const dashboardDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const mobileMenuButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
                setIsLanguageMobileOpen(false);
            }
            if (dashboardDropdownRef.current && !dashboardDropdownRef.current.contains(event.target)) {
                setIsMyDashboardMobileOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const allCategories = reduxCategories || [];

    const fetchSearchResults = useCallback(async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }
        setLoadingSuggestions(true);
        setShowSuggestions(true);
        try {
            // Using the identified endpoint for keyword search
            const { data } = await axios.get(`/api/products?keyword=${encodeURIComponent(query)}`);
            setSearchResults(data.products || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, []);

    const debouncedSearch = useRef(
        useCallback((query) => {
            const handler = setTimeout(() => {
                fetchSearchResults(query);
            }, 300); // 300ms debounce time
            return () => {
                clearTimeout(handler);
            };
        }, [fetchSearchResults])
    );

    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch.current(searchQuery);
        } else {
            setSearchResults([]);
            setShowSuggestions(false);
        }
    }, [searchQuery, debouncedSearch]);

    const currencies = [
        { code: "BDT", name: "BDT" },
    ];
    const languages = [
        { code: "en", name: "English" },
    ];
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const topBarLinks = [
        { href: "/support", text: "Support" },
        { href: "/contact", text: "Contact" },
    ];
    const searchCategories = [
        { value: "All Category", label: "All Category" },
        { value: "Category 1", label: "Category 1" },
        { value: "Category 2", label: "Category 2" },
        { value: "Category 3", label: "Category 3" },
        { value: "Category 4", label: "Category 4" },
    ];
    const [selectedSearchCategory, setSelectedSearchCategory] = useState(searchCategories[0]);
    const [navLinks, setNavLinks] = useState([]);

    const [activeLinkIndex, setActiveLinkIndex] = useState(null);

    useEffect(() => {
        const storedIndex = sessionStorage.getItem('activeLinkIndex');
        if (storedIndex !== null) {
            setActiveLinkIndex(parseInt(storedIndex, 10));
        }
    }, []);

    const handleLinkClick = (index) => {
        setActiveLinkIndex(index);
        sessionStorage.setItem('activeLinkIndex', index);
    };

    const [openDropdown, setOpenDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const handleDropdownToggle = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNavItems = async () => {
            try {
                const { data } = await axios.get('/api/admin/navitems');
                const formattedNavLinks = data
                    .filter(item => !item.parent)
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => {
                        const children = data
                            .filter(child => child.parent === item._id)
                            .sort((a, b) => a.order - b.order)
                            .map(child => ({ href: child.path, text: child.name }));
                        return {
                            href: item.path,
                            text: item.name,
                            dropdown: children.length > 0 ? children : null,
                        };
                    });
                setNavLinks(formattedNavLinks);
            } catch (error) {
                console.error('Error fetching nav items:', error);
            }
        };
        fetchNavItems();
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleAllCat = () => setIsAllCatOpen(!isAllCatOpen);
    const toggleCurrencyDropdown = () => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
    const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    const toggleMyDashboardDropdown = () => setIsMyDashboardDropdownOpen(!isMyDashboardDropdownOpen);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setTopHeaderVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, topHeaderVisible, handleScroll]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        dispatch(getAllCategories());
    }, [dispatch, error]);

    const router = useRouter();
    const pathname = usePathname();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        let url = `/products`;
        const params = new URLSearchParams();

        if (searchQuery.trim()) {
            params.append('keyword', encodeURIComponent(searchQuery.trim()));
        }

        if (selectedSearchCategory && selectedSearchCategory.name !== "All Category") {
            params.append('category', encodeURIComponent(selectedSearchCategory.name));
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        router.push(url);
        setSearchQuery("");
        setShowSuggestions(false); // Hide suggestions after search
        setSearchResults([]); // Clear search results
    };

    return (
        <>
            {/* Topbar Start */}
            <div className="topbar-wrapper">
                <div className="topbar-row">
                    <div className="topbar-col-left">
                        <div className="topbar-links-wrapper">
                            {topBarLinks.map((link, index) => (
                                <React.Fragment key={index}>
                                    <Link href={link.href} className="topbar-link">{link.text}</Link>
                                    {index < topBarLinks.length - 1 && <small className="topbar-divider"> / </small>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="topbar-col-middle">
                        <small className="topbar-call-text">Call Us:</small>
                        <a href="#" className="topbar-call-number">{phoneNumber}</a>
                    </div>
                    <div className="topbar-col-right">
                        <div className="topbar-links-wrapper">
                            <div className="topbar-dropdown">
                                <a href="#" className="topbar-dropdown-toggle" data-bs-toggle="dropdown"><small className="topbar-dropdown-text">
                                    {selectedCurrency.name}</small></a>
                                <div className="topbar-dropdown-menu">
                                    {currencies.map((currency) => (
                                        <a href="#" key={currency.code} className="topbar-dropdown-item" onClick={() => setSelectedCurrency(currency)}>{currency.name}</a>
                                    ))}
                                </div>
                            </div>
                            <div className="topbar-dropdown">
                                <a href="#" className="topbar-dropdown-toggle" data-bs-toggle="dropdown"><small className="topbar-dropdown-text">
                                    {selectedLanguage.name}</small></a>
                                <div className="topbar-dropdown-menu">
                                    {languages.map((language) => (
                                        <a href="#" key={language.code} className="topbar-dropdown-item" onClick={() => setSelectedLanguage(language)}>{language.name}</a>
                                    ))}
                                </div>
                            </div>
                            {isClient &&
                                <div className="topbar-dropdown">
                                    <a href="#" className="topbar-dropdown-toggle" data-bs-toggle="dropdown"><small className="topbar-dropdown-text"><i
                                        className="fa fa-home me-2"></i> My Dashboard</small></a>
                                    <div className="topbar-dropdown-menu">
                                        {isAuthenticated ? (
                                            <>
                                                {user.role === "admin" && (
                                                    <>
                                                        <Link href="/admin/dashboard" className="topbar-dropdown-item">Admin Dashboard</Link>

                                                    </>
                                                )}
                                                <Link href="/profile" className="topbar-dropdown-item">My Account</Link>
                                                <Link href="/orders/user" className="topbar-dropdown-item">My Orders</Link>
                                                <a href="#" className="topbar-dropdown-item" onClick={() => dispatch(logout())}>Log Out</a>
                                            </>
                                        ) : (
                                            <>
                                                <Link href="/login" className="topbar-dropdown-item">Login</Link>
                                                <Link href="/register" className="topbar-dropdown-item">Register</Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-header-wrapper">
                <div className="main-header-row">
                    <div className="main-header-col-left">
                        <div className="main-header-brand-wrapper">
                            <Link href="/" className="main-header-brand">
                                {siteLogoUrl ? (
                                    <Image
                                        src={siteLogoUrl}
                                        alt="Logo"
                                        width={120} // Adjust width as needed
                                        height={40} // Adjust height as needed
                                        priority
                                    />
                                ) : (
                                    <h1 className="main-header-title"><i className="main-header-icon"></i>JIBON DECORETOR</h1>
                                )}
                            </Link>
                        </div>
                    </div>
                    <div className="main-header-col-center">
                        <div className="main-header-search-container">
                            <form onSubmit={handleSearchSubmit} className="main-header-search-box">
                                <input
                                    className="main-header-search-input"
                                    type="text"
                                    placeholder="Search Looking For?"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value.trim()) {
                                            setShowSuggestions(true);
                                        } else {
                                            setShowSuggestions(false);
                                            setSearchResults([]);
                                        }
                                    }}
                                    onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click on suggestions
                                />
                                <select
                                    className="main-header-search-select"
                                    onChange={(e) => setSelectedSearchCategory(allCategories.find(c => c.name === e.target.value))}
                                    value={selectedSearchCategory?.name || "All Category"}
                                >
                                    <option value="All Category">All Category</option> {/* Default option */}
                                    {allCategories.map((category) => (
                                        <option key={category._id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                <button type="submit" className="main-header-search-button"><SearchIcon /></button>
                                {showSuggestions && (searchQuery.trim() || loadingSuggestions) && (
                                    <div className="search-suggestions-dropdown">
                                        {loadingSuggestions ? (
                                            <p className="loading-text">Loading...</p>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map((product) => (
                                                <Link href={`/product/${product._id}`} key={product._id} className="suggestion-item">
                                                    <div className="suggestion-image">
                                                        <Image
                                                            src={(product.image && product.image.length > 0) ? product.image[0].url : "/images/placeholder.svg"}
                                                            alt={product.name}
                                                            width={50}
                                                            height={50}
                                                        />
                                                    </div>
                                                    <div className="suggestion-details">
                                                        <p className="suggestion-name">{product.name}</p>
                                                        <p className="suggestion-price">${product.price.toFixed(2)}</p>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="no-results-text">No products found.</p>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className="main-header-col-right">
                        <div className="main-header-actions-wrapper">
                            {isClient ? (
                                isAuthenticated ? (
                                    <Link href="/profile" className="main-header-action-link profile-link">
                                        <span className="main-header-action-link-icon-wrapper">
                                            <Image
                                                src={user.avatar.url}
                                                alt={user.name}
                                                width={44}
                                                height={44}
                                                className="profile-avatar"
                                            />
                                        </span>
                                        <span className="main-header-action-link-text">{user.name}</span>
                                    </Link>
                                ) : (
                                    <Link href="/register" className="main-header-action-link">
                                        <span className="main-header-action-link-icon-wrapper"><PersonAddIcon /></span>
                                        <span className="main-header-action-link-text">Login/Register</span>
                                    </Link>
                                )
                            ) : (
                                <div style={{ width: '150px' }} />
                            )}
                            <Link href="/cart" className="main-header-action-link">
                                <span className={`main-header-action-link-icon-wrapper ${isCartAnimating ? 'cart-icon-shake' : ''}`}>
                                    <ShoppingCartIcon />
                                    {isClient && cartItems.length > 0 && (
                                        <span className="main-header-cart-badge">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* Topbar End */}

            {/* Mobile Topbar Start */}
            {/* This section will only be visible on small screens */}
            <div className="mobile-topbar-content d-lg-none">

                <div className="mobile-topbar-group mobile-topbar-call">
                    <small className="topbar-call-text">Call:</small>
                    <a href="#" className="topbar-call-number">{phoneNumber}</a>
                </div>
                <div className="mobile-topbar-group mobile-topbar-actions">
                    {/* Language Dropdown for mobile topbar */}
                    <div className="topbar-dropdown" ref={languageDropdownRef}>
                        <a href="#" className="topbar-dropdown-toggle" onClick={(e) => { e.preventDefault(); setIsLanguageMobileOpen(!isLanguageMobileOpen); }}>
                            <small className="topbar-dropdown-text">{selectedLanguage.name}</small>
                        </a>
                        <div className={`mobile-topbar-collapsible-menu ${isLanguageMobileOpen ? 'open' : ''}`}>
                            {languages.map((language) => (
                                <a href="#" key={language.code} className="topbar-dropdown-item" onClick={() => setSelectedLanguage(language)}>{language.name}</a>
                            ))}
                        </div>
                    </div>
                    {/* My Dashboard Dropdown for mobile topbar */}
                    {isClient &&
                        <div className="topbar-dropdown" ref={dashboardDropdownRef}>
                            <a href="#" className="topbar-dropdown-toggle" onClick={(e) => { e.preventDefault(); setIsMyDashboardMobileOpen(!isMyDashboardMobileOpen); }}>
                                <small className="topbar-dropdown-text"><i className="fa fa-home me-2"></i>My Dashboard</small>
                            </a>
                            <div className={`mobile-topbar-collapsible-menu ${isMyDashboardMobileOpen ? 'open' : ''}`}>
                                {isAuthenticated ? (
                                    <>
                                        {user.role === "admin" && (
                                            <Link href="/admin/dashboard" className="topbar-dropdown-item">Admin Dashboard</Link>
                                        )}
                                        <Link href="/profile" className="topbar-dropdown-item">My Account</Link>
                                        <Link href="/orders/user" className="topbar-dropdown-item">My Orders</Link>
                                        <a href="#" className="topbar-dropdown-item" onClick={() => dispatch(logout())}>Log Out</a>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="topbar-dropdown-item">Login</Link>
                                        <Link href="/register" className="topbar-dropdown-item">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* Mobile Topbar End */}

            {/* Navbar & Hero Start */}
            <div className="navbar-wrapper">

                <div className="navbar-main-row">
                    <div className="hidden lg:block lg:w-1/4">
                        <nav className="navbar navbar-light position-relative">
                            <div className={`category-dropdown-content rounded-bottom ${isAllCatOpen ? 'open' : ''}`} id="allCat">
                                <ul className="list-unstyled categories-bars">
                                    {allCategories.map((category, index) => (
                                        <li key={index}>
                                            <div className="categories-bars-item">
                                                <Link href={`/products?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>
                                                <span>({category.count})</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div className="navbar-main-links-column">
                        <div className="navbar-main-links-nav">
                            <Link href="/" className="navbar-mobile-brand">
                                {siteLogoUrl ? (
                                    <Image
                                        src={siteLogoUrl}
                                        alt="Logo"
                                        width={100} // Adjust width as needed for mobile
                                        height={30} // Adjust height as needed for mobile
                                        priority
                                    />
                                ) : (
                                    <h1 className="navbar-mobile-brand-title"><i className="navbar-mobile-brand-icon"></i>JIBON DECORETOR</h1>
                                )}
                            </Link>
                            {isMobileSearchOpen ? (
                                <div className="mobile-search-bar-expanded">
                                    <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                                        <input
                                            className="mobile-search-input"
                                            type="text"
                                            placeholder="Search Looking For?"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                if (e.target.value.trim()) {
                                                    setShowSuggestions(true);
                                                } else {
                                                    setShowSuggestions(false);
                                                    setSearchResults([]);
                                                }
                                            }}
                                            onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click on suggestions
                                        />
                                        <select
                                            className="mobile-search-select"
                                            onChange={(e) => setSelectedSearchCategory(allCategories.find(c => c.name === e.target.value))}
                                            value={selectedSearchCategory?.name || "All Category"}
                                        >
                                            <option value="All Category">All Category</option> {/* Default option */}
                                            {allCategories.map((category) => (
                                                <option key={category._id} value={category.name}>{category.name}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="mobile-search-button"><SearchIcon /></button>
                                        {showSuggestions && (searchQuery.trim() || loadingSuggestions) && (
                                            <div className="search-suggestions-dropdown mobile-search-suggestions-dropdown">
                                                {loadingSuggestions ? (
                                                    <p className="loading-text">Loading...</p>
                                                ) : searchResults.length > 0 ? (
                                                    searchResults.map((product) => (
                                                        <Link href={`/product/${product._id}`} key={product._id} className="suggestion-item">
                                                            <Image src={(product.image && product.image.length > 0) ? product.image[0].url : "/images/placeholder.svg"} alt={product.name} width={50} height={50} />
                                                            <div className="suggestion-details">
                                                                <p className="suggestion-name">{product.name}</p>
                                                                <p className="suggestion-price">${product.price.toFixed(2)}</p>
                                                            </div>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className="no-results-text">No products found.</p>
                                                )}
                                            </div>
                                        )}
                                    </form>
                                    <button className="mobile-search-close-btn" onClick={toggleMobileSearch}><CloseIcon /></button>
                                </div>
                            ) : (
                                <div className="mobile-nav-icons-container">
                                    <a href="#" className="nav-link" onClick={toggleMobileSearch}><span className="mobile-nav-icon"><SearchIcon /></span></a>
                                    <Link href="/cart" className="nav-link">
                                        <span className="mobile-nav-cart-icon-wrapper mobile-nav-icon">
                                            <ShoppingCartIcon />
                                            {isClient && cartItems.length > 0 &&
                                                <span className="mobile-nav-cart-badge">
                                                    {cartItems.length}
                                                </span>
                                            }
                                        </span>
                                    </Link>
                                    {isClient && (
                                        !isAuthenticated ? (
                                            <Link href="/register" className="nav-link"><span className="mobile-nav-icon"><PersonAddIcon /></span></Link>
                                        ) : (
                                            <Link href="/profile" className="nav-link">
                                                <Image
                                                    src={user.avatar.url}
                                                    alt={user.name}
                                                    width={24} // Smaller size for mobile icon
                                                    height={24} // Smaller size for mobile icon
                                                    className="profile-avatar mobile-profile-avatar"
                                                />
                                            </Link>
                                        )
                                    )}
                                </div>
                            )}
                            <button ref={mobileMenuButtonRef} className="navbar-main-links-toggler" type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <CloseIcon /> : <span className="fa fa-bars fa-1x"></span>}
                            </button>
                            <div ref={mobileMenuRef} className={`navbar-main-links-collapse ${isMobileMenuOpen ? 'open' : ''}`}>
                                <div className="navbar-nav py-0 flex-col lg:flex-row">
                                    {navLinks.map((link, index) => (
                                        <React.Fragment key={index}>
                                            {link.dropdown ? (
                                                <div className="nav-item dropdown" ref={openDropdown === index ? dropdownRef : null}>
                                                    <a href="#" className={`nav-link dropdown-toggle ${activeLinkIndex === index ? 'active' : ''}`} onClick={() => { handleDropdownToggle(index); handleLinkClick(index); }}>
                                                        {link.text}
                                                        {link.dropdown && <ArrowDropDownIcon />}
                                                    </a>
                                                    <div className={`navbar-main-links-dropdown-menu ${openDropdown === index ? 'show' : ''}`}>
                                                        {link.dropdown.map((item, itemIndex) => (
                                                            <Link href={item.href} key={itemIndex} className={`dropdown-item ${activeLinkIndex === index ? 'active' : ''}`} onClick={() => handleLinkClick(index)}>{item.text}</Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="nav-item">
                                                    <Link href={link.href} className={`nav-link ${activeLinkIndex === index ? 'active' : ''}`} onClick={() => handleLinkClick(index)}>{link.text}</Link>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <a href="#" className="navbar-contact-button btn btn-secondary rounded-pill py-2 px-4 px-lg-3 mb-3 mb-md-3 mb-lg-0"><i className="fa fa-mobile-alt me-2"></i> {phoneNumber}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
