import { useState } from 'react';
import { ConfigProvider, Menu } from 'antd';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { CgCarousel } from "react-icons/cg";
import { MdOutlineCategory, MdOutlineLocalShipping } from "react-icons/md";
import { TbBrandCodesandbox } from "react-icons/tb";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaBasketShopping, FaPenToSquare } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";

const items = [
    {
        key: '/',
        icon: <TbLayoutDashboardFilled/>,
        label: 'Dashbaord',
    },
    {
        key: 'banners',
        icon: <CgCarousel />,
        label: 'Banners',
        children: [
            {
                key: '/banner',
                label: 'Banners',
            },
            {
                key: '/banner/add',
                label: 'Add Banner',
            }
        ]
    },
    {
        key: 'category',
        icon: <MdOutlineCategory />,
        label: 'Category',
        children: [
            {
                key: '/category',
                label: 'Category',
            },
            {
                key: '/category/add',
                label: 'Add Category',
            },
        ]
    },
    {
        key: 'products',
        icon: <LuBoxes />,
        label: 'Products',
        children: [
            {
                key: '/product',
                label: 'Products',
            },
            {
                key: '/product/add',
                label: 'Add Product',
            }
        ]
    },
    {
        key: 'brands',
        icon: <TbBrandCodesandbox />,
        label: 'Brands',
        children: [
            {
                key: '/brand',
                label: 'Brands',
            },
            {
                key: '/brand/add',
                label: 'Add Brand',
            }
        ]
    },
    {
        key: 'shipping',
        icon: <MdOutlineLocalShipping />,
        label: 'Shipping',
        children: [
            {
                key: '/shipping',
                label: 'Shipping',
            },
            {
                key: '/shipping/add',
                label: 'Add Shipping',
            }
        ]
    },
    {
        key: '/orders',
        icon: <FaBasketShopping />,
        label: 'Orders',
    },
    // {
    //     key: '/reviews',
    //     icon: <MdOutlineReviews />,
    //     label: 'Reviews',
    // },
    {
        key: 'posts',
        icon: <FaPenToSquare />,
        label: 'Posts',
        children: [
            {
                key: '/post',
                label: 'Posts',
            },
            {
                key: '/post/add',
                label: 'Add Post',
            }
        ]
    },
    {
        key: 'tags',
        icon: <BiSolidPurchaseTag />,
        label: 'Tags',
        children: [
            {
                key: '/tag',
                label: 'Tags',
            },
            {
                key: '/tag/add',
                label: 'Add Tag',
            }
        ]
    },
]

export default function Base() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleMenuClick = ({ key }) => {
      if (key) {
        navigate(key);
      }
    };
    
    return (
        <>
            <div className="flex flex-1">
            <ConfigProvider
                theme={{
                    components: {
                    Menu: {
                        collapsedWidth: 60,
                        iconSize: 20,
                        collapsedIconSize: 20,
                        darkItemHoverBg: 'rgb(0 0 0 / 0.5)',
                        darkItemSelectedColor: 'rgb(200 200 255 / 1)',
                    },
                    },
                }}
            >
                <Menu
                    subMenuCloseDelay = "0.1"
                    subMenuOpenDelay= "0.1"
                    className=' max-w-52 sticky overflow-auto'
                    selectedKeys={[location.pathname]}
                    
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    items={items}
                    onClick={handleMenuClick}
                    // style={{ flex: "auto" }}
                />
            </ConfigProvider>
                <div className="flex flex-col flex-1 min-h-screen overflow-y-auto">
                    <header className='bg-white shadow-md sticky top-0 z-10'>
                        <nav className="">
                            <div className="mx-auto max-w-7xl px-1 sm:px-3 lg:px-5">
                                <div className="relative flex h-16 items-center justify-between">
                                    <div className="absolute inset-y-0 left-0 flex items-center">
                                        <button 
                                            type="button" 
                                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" 
                                            aria-controls="mobile-menu" 
                                            aria-expanded="false"
                                            onClick={toggleCollapsed}
                                        >
                                            <IoMenu className='text-3xl'/>
                                            <span className="absolute -inset-0.5"></span>
                                            <span className="sr-only">Open main menu</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <main className='flex-1 overflow-auto flex flex-col'>
                        <div className="p-5 flex-1">
                            <Outlet/>
                        </div>
                        <footer className="py-6 text-xs bg-slate-200 justify-center text-center flex gap-2">
                            Copyright © 
                            <Link href="https://www.bachatmart.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline underline-offset-4">
                                Bachat Mart 
                            </Link>
                            2024
                        </footer>
                    </main>
                </div>
            </div>
        </>
    )
}
