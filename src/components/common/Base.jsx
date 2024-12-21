import { useState } from 'react';
import { ConfigProvider, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { CgCarousel } from "react-icons/cg";
import { MdOutlineCategory, MdOutlineLocalShipping, MdOutlineReviews } from "react-icons/md";
import { TbBrandCodesandbox } from "react-icons/tb";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaPenToSquare } from "react-icons/fa6";
import { LuBoxes } from "react-icons/lu";

const items = [
    {
        key: '1',
        icon: <TbLayoutDashboardFilled/>,
        label: 'Dashbaord',
    },
    {
        key: 'sub1',
        icon: <CgCarousel />,
        label: 'Banners',
        children: [
            {
                key: '2',
                // icon: '',
                label: 'Banners',
            },
            {
                key: '3',
                label: 'Add Banner',
            }
        ]
    },
    {
        key: 'sub2',
        icon: <MdOutlineCategory />,
        label: 'Category',
        children: [
            {
                key: '4',
                label: 'Category',
            },
            {
                key: '5',
                label: 'Add Category',
            },
        ]
    },
    {
        key: 'sub3',
        icon: <LuBoxes />,
        label: 'Products',
        children: [
            {
                key: '6',
                label: 'Products',
            },
            {
                key: '7',
                label: 'Add Product',
            }
        ]
    },
    {
        key: 'sub4',
        icon: <TbBrandCodesandbox />,
        label: 'Brands',
        children: [
            {
                key: '8',
                label: 'Brands',
            },
            {
                key: '9',
                label: 'Add Brand',
            }
        ]
    },
    {
        key: 'sub5',
        icon: <MdOutlineLocalShipping />,
        label: 'Shipping',
        children: [
            {
                key: '10',
                label: 'Shipping',
            },
            {
                key: '11',
                label: 'Add Shipping',
            }
        ]
    },
    {
        key: '12',
        icon: <BiSolidPurchaseTag />,
        label: 'Orders',
    },
    {
        key: '13',
        icon: <MdOutlineReviews />,
        label: 'Reviews',
    },
    {
        key: 'sub6',
        icon: <FaPenToSquare />,
        label: 'Posts',
        children: [
            {
                key: '14',
                label: 'Posts',
            },
            {
                key: '15',
                label: 'Add Post',
            }
        ]
    },
]

export default function Base() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };

    return (
        <>
            <div className="flex flex-1">
            <ConfigProvider
                theme={{
                    components: {
                    Menu: {
                        /* here is your component tokens */
                        collapsedWidth: 60,
                        iconSize: 20,
                        collapsedIconSize: 20,
                        
                    },
                    },
                }}
            >
                <Menu
                    subMenuCloseDelay = "0.1"
                    subMenuOpenDelay= "0.1"
                    className=' max-w-52 sticky overflow-auto'
                    defaultSelectedKeys={['1']}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    items={items}
                />
            </ConfigProvider>
                {/* <Sidebar collapsed={!isSidebarOpen}>
                    <Menu>
                        <MenuItem>Dashboard</MenuItem>
                        <SubMenu title="Posts">
                            <MenuItem>Posts</MenuItem>
                            <MenuItem>Categories</MenuItem>
                        </SubMenu>
                    </Menu>
                </Sidebar> */}
                <div className="flex flex-col flex-1 min-h-screen overflow-y-auto">
                    <header className='bg-white shadow-md sticky top-0 z-10'>
                        <nav className="">
                            <div className="mx-auto max-w-7xl px-1 sm:px-3 lg:px-5">
                                <div className="relative flex h-16 items-center justify-between">
                                    {/* <!-- Mobile menu button--> */}
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