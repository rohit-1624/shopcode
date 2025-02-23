import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import firebaseAppConfig from "../../util/firebase-config"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

const auth = getAuth(firebaseAppConfig)

const Layout = ({ children }) => {
    const [size, setSize] = useState(280)
    const [mobileSize, setMobileSize] = useState(0)
    const [accountMenu, setAccountMenu] = useState(false)
    const [session, setSession] = useState(null)
    const location = useLocation()
    // console.log(location)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user)
            }
            else {
                setSession(null)
            }
        })
    }, [])

    const menus = [
        {
            label: 'Dashboard',
            icon: <i className="ri-dashboard-3-line mr-2"></i>,
            link: '/admin/dashboard'
        },
        {
            label: 'Customers',
            icon: <i className="ri-user-line mr-2"></i>,
            link: '/admin/customers'
        },
        {
            label: 'Products',
            icon: <i className="ri-shopping-cart-line mr-2"></i>,
            link: '/admin/products'
        },
        {
            label: 'Orders',
            icon: <i className="ri-shape-line mr-2"></i>,
            link: '/admin/orders'
        },
        {
            label: 'Payments',
            icon: <i className="ri-money-dollar-circle-line mr-2"></i>,
            link: '/admin/payments'
        },
        {
            label: 'Settings',
            icon: <i className="ri-settings-3-line mr-2"></i>,
            link: '/admin/settings'
        }
    ]

    // Desktop
    return (
        <>
            <div className="md:block hidden">
                <aside
                    className="bg-indigo-600 fixed top-0 left-0 h-full overflow-hidden "
                    style={{
                        width: size,
                        transition: '0.3s'
                    }}
                >
                    <div className="flex flex-col">
                        {
                            menus.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className="px-4 py-3 text-gray-50 text-[17.5px] hover:bg-rose-600 hover:text-white "
                                    style={{
                                        background: (location.pathname === item.link) ? 'red' : 'transparent'
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))
                        }
                        <button
                            onClick={() => signOut(auth)}
                            className=" text-left px-4 py-3 text-gray-50 text-[17.5px] hover:bg-rose-600 hover:text-white "
                        >
                            <i className="ri-logout-circle-r-line mr-2"></i>
                            Logout
                        </button>
                    </div>
                </aside>
                <section
                    className="bg-gray-100 min-h-screen"
                    style={{
                        marginLeft: size,
                        transition: '0.3s'
                    }}
                >
                    <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
                        <div className="flex gap-4 items-center">
                            <button
                                className="bg-gray-50 hover:bg-indigo-600 hover:text-white w-8 h-8"
                                onClick={() => setSize(size === 280 ? 0 : 280)}
                            >
                                <i className="ri-menu-2-line text-xl"></i>
                            </button>
                            <h1 className="text-md font-semibold">Shopcode</h1>
                        </div>

                        <div>
                            <div className="relative cursor-pointer">
                                <img
                                    src="/images/avt.avif"
                                    className="w-10 h-10 rounded-full"
                                    onClick={() => setAccountMenu(!accountMenu)}
                                />
                                {
                                    accountMenu &&
                                    <div className="absolute top-18 right-0 bg-white w-[200px] p-6 shadow-lg ">
                                        <div>
                                            <h1 className="text-lg font-semibold">{session && session.displayName ? session.displayName : "Admin"} </h1>
                                            <p className="text-gray-500">{session.email}</p>
                                            <div className="h-px bg-gray-200 my-4" />
                                            <button onClick={() => signOut(auth)}>
                                                <i className="ri-logout-circle-r-line"></i>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </nav>
                    <div>
                        {children}
                    </div>
                </section>
            </div>




            {/* Mobile */}
            <div className="md:hidden block">
                <aside
                    className="bg-indigo-600 fixed top-0 left-0 h-full z-50 overflow-hidden "
                    style={{
                        width: mobileSize,
                        transition: '0.3s'
                    }}
                >
                    <div className="flex flex-col">
                        <button
                            className="text-left mx-4 mt-4"
                            onClick={() => setMobileSize(mobileSize === 0 ? 280 : 0)}

                        >
                            <i className="ri-menu-2-fill text-white text-xl"></i>
                        </button>
                        {
                            menus.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className="px-4 py-3 text-gray-50 text-[17.5px] hover:bg-rose-600 hover:text-white "
                                    style={{
                                        background: (location.pathname === item.link) ? 'red' : 'transparent'
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))
                        }
                        <button
                            onClick={() => signOut(auth)}
                            className=" text-left px-4 py-3 text-gray-50 text-[17.5px] hover:bg-rose-600 hover:text-white "
                        >
                            <i className="ri-logout-circle-r-line mr-2"></i>
                            Logout
                        </button>
                    </div>
                </aside>
                <section
                    className="bg-gray-100 min-h-screen"
                    style={{
                        transition: '0.3s'
                    }}
                >
                    <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
                        <div className="flex gap-4 items-center">
                            <button
                                className="bg-gray-50 hover:bg-indigo-600 hover:text-white w-8 h-8"
                                onClick={() => setMobileSize(mobileSize === 0 ? 280 : 0)}
                            >
                                <i className="ri-menu-2-line text-xl"></i>
                            </button>
                            <h1 className="text-md font-semibold">Shopcode</h1>
                        </div>

                        <div>
                            <div className="relative cursor-pointer">
                                <img
                                    src="/images/avt.avif"
                                    className="w-10 h-10 rounded-full"
                                    onClick={() => setAccountMenu(!accountMenu)}
                                />
                                {
                                    accountMenu &&
                                    <div className="absolute top-18 right-0 bg-white w-[200px] p-6 shadow-lg ">
                                        <div>
                                            <h1 className="text-lg font-semibold">{session && session.displayName ? session.displayName : "Admin"}</h1>
                                            <p className="text-gray-500">{session.email}</p>
                                            <div className="h-px bg-gray-200 my-4" />
                                            <button onClick={() => signOut(auth)}>
                                                <i className="ri-logout-circle-r-line"></i>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </nav>
                    <div>
                        {children}
                    </div>
                </section>
            </div>
        </>
    )
}

export default Layout