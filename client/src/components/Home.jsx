import { useEffect, useState } from "react";
import Layout from "./Layout"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import firebaseAppConfig from "../util/firebase-config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore,  query, getDocs, serverTimestamp, where, doc } from "firebase/firestore";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Swal from "sweetalert2";
import axios from 'axios';
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useNavigate } from "react-router-dom";

const db = getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)

const Home = ({ slider, title = "Latest Products" }) => {
    const navigate = useNavigate()
    const { error, isLoading, Razorpay } = useRazorpay();
    const [products, setProducts] = useState([])
    const [session, setSession] = useState(null)
    const [updateUI, setUpdateUI] = useState(false)

    useEffect(() => (
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user)
            }
            else {
                setSession(null)
            }
        }

        )
    ), [])

    useEffect(() => {
        const req = async () => {
            const snapshot = await getDocs(collection(db, "products"))
            const tmp = []
            snapshot.forEach((doc) => {
                const allProducts = doc.data()
                allProducts.id = doc.id
                tmp.push(allProducts)
            })
            setProducts(tmp)
        }
        req()
    }, [products])

    const addToCart = async (item) => {
        try {
            item.userId = session.uid
            await addDoc(collection(db, "carts"), item)
            setUpdateUI(!updateUI)
            new Swal({
                icon: "success",
                title: "Product Added !"
            })
        }
        catch (err) {
            new Swal({
                icon: "error",
                title: "Failed !",
                text: err.message
            })
        }

    }

    const buyNow = async (product) => {
        try {
            const col = collection(db, "addresses")
            const q = query(col, where("userId", "==", session.uid))
            const snapshot = await getDocs(q)
            if (snapshot.empty)
            {
                new Swal({
                    icon: 'info',
                    title: 'Please update your address',
                    confirm: ()=>alert()
                })
                .then((result) => {
                    if(result.isConfirmed)
                    {
                        navigate("/profile#address")
                    }
                })
                return false;
            }
            product.userId = session.uid
            product.status = "pending"
            const amount = product.price - (product.price * product.discount) / 100
            const { data } = await axios.post('http://localhost:8080/order', { amount: amount })
            console.log(data)
            const options = {
                key: 'rzp_test_x4CFM9QD0dIlUp',
                amount: data.amount,
                order_id: data.orderId,
                name: 'Online Shopping',
                description: product.title,
                image: 'https://raw.githubusercontent.com/rohit-1624/shopcode-images/refs/heads/main/images/shoppinglogo.jpg',
                handler: async function (response) {
                    product.email = session.email
                    product.customerName = session.displayName
                    product.createdAt = serverTimestamp()
                    // product.address = address
                    await addDoc(collection(db, "orders"), product)
                    navigate('/profile')
                },
                notes: {
                    name: session.displayName
                }
            }
            const rzp = new Razorpay(options)

            rzp.open()       //opens payment dialogue

            rzp.on("payment.failed", function (response) {
                console.log(response)
                navigate('/failed')
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <Layout update={updateUI}>
            <div>
                {
                    slider &&
                    <header>
                        <Swiper
                            navigation={true}
                            modules={[Navigation, Pagination]}
                            pagination={true}
                            spaceBetween={50}
                            slidesPerView={1}
                        >
                            <SwiperSlide>
                                <img src="/images/p1.png" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/p2.png" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/p3.png" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/p4.png" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="/images/p5.png" />
                            </SwiperSlide>
                        </Swiper>
                    </header>
                }

                <div className="md:p=16 p-8">
                    <h1 className="text-3xl font-bold text-center">{title}</h1>
                    <p className="mx-auto text-center text-gray-600 md:w-7/12 mt-2 mb-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate vel numquam, blanditiis impedit perspiciatis error dolor hic porro molestias, reprehenderit non consequuntur. </p>
                    <div className="md:w-10/12 mx-auto grid md:grid-cols-4 gap-16">
                        {
                            products.map((item, index) => (
                                <div key={index} className="bg-white shadow-lg">
                                    <img src={item.imageUrl} />
                                    <div className="p-4 capitalize">
                                        <h1 className="text-lg font-semibold">{item.title}</h1>
                                        <div className="space-x-2">
                                            <label className="font-bold text-lg"> ₹{item.price - (item.price * item.discount) / 100}</label>
                                            <del> ₹{item.price}</del>
                                            <label className="text-gray-600">{item.discount}% </label>
                                        </div>
                                        <button className="bg-green-500 py-2 w-full rounded text-white font-semibold mt-2" onClick={() => buyNow(item)}>Buy Now</button>
                                        <button onClick={() => addToCart(item)} className="bg-rose-500 py-2 w-full rounded text-white font-semibold mt-2">
                                            <i className="ri-shopping-cart-line mr-2"></i>
                                            Add to Cart
                                        </button>

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Home