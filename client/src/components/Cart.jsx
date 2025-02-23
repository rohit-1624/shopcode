import { useEffect, useState } from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../util/firebase-config";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, getDocs, collection, addDoc, doc, query, where, deleteDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { useNavigate } from "react-router-dom";

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)

const Cart = () => {
    const navigate = useNavigate()
    const [address, setAddress] = useState(null)
    const [products, setProducts] = useState([])
    const [session, setSession] = useState(null)
    const [updateUI, setUpdateUI] = useState(false)
    const { error, isLoading, Razorpay } = useRazorpay();


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
            if (session) {
                const col = collection(db, "carts")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                const tmp = []
                snapshot.forEach((doc) => {
                    const document = doc.data()
                    document.cartId = doc.id
                    tmp.push(document)
                })
                setProducts(tmp)
            }
        }

        req()
    }, [session, products, updateUI])

    useEffect(() => {
        const req = async () => {
            if (session) {
                const col = collection(db, "addresses")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                snapshot.forEach((doc) => {
                    const document = doc.data()
                    setAddress(document)
                })
            }
        }

        req()
    }, [session])

    const getPrice = (products) => {
        let sum = 0;
        for (let item of products) {
            let amount = Math.round(item.price - (item.price * item.discount) / 100)
            sum = sum + amount;
        }
        return sum;
    }

    const removeCart = async (id) => {
        try {
            const ref = doc(db, "carts", id)
            await deleteDoc(ref)
            setUpdateUI(!updateUI)
        }
        catch {
            console.log(err)
        }
    }

    const buyNow = async () => {
        try {
            const amount = getPrice(products)
            const { data } = await axios.post('http://localhost:8080/order', { amount: amount })
            console.log(data)
            const options = {
                key: 'rzp_test_x4CFM9QD0dIlUp',
                amount: data.amount,
                order_id: data.orderId,
                name: 'Online Shopping',
                description: 'Bulk products',
                image: 'https://raw.githubusercontent.com/rohit-1624/shopcode-images/refs/heads/main/images/shoppinglogo.jpg',
                handler: async function (response) {
                    for (let item of products) {
                        let product = {
                            ...item,
                            userId: session.uid,
                            status: "pending",
                            email: session.email,
                            customerName: session.displayName,
                            createdAt: serverTimestamp(),
                            address: address
                        }
                        await addDoc(collection(db, "orders"), product)
                        await removeCart(item.cartId)
                    }
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
            <div className="md:my-16 mx-auto md:w-7/12 bg-white shadow-lg border rounded-md p-8">
                <div className="flex items-center gap-4">
                    <i className="ri-shopping-cart-line text-4xl"></i>
                    <h1 className="text-3xl font-semibold">Cart</h1>
                </div>
                <hr className="my-6" />
                <div className="space-y-12">
                    {
                        products.map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <img src={item.imageUrl} className="w-[100px] border border-3 border-white shadow" />
                                <div>
                                    <h1 className="font-semibold capitalize text-lg">{item.title}</h1>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex space-x-3">
                                            <label className="text-lg font-semibold"> ₹{item.price - (item.price * item.discount) / 100}</label>
                                            <del> ₹{item.price}</del>
                                            <label className="text-gray-500">{item.discount}% Discount </label>
                                        </div>
                                        <button className="w-fit bg-rose-600 text-white px-4 py-2 rounded" onClick={() => removeCart(item.cartId)}>
                                            <i className="ri-delete-bin-line mr-2"></i>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <hr className="my-6" />
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-2xl">Total : ₹{getPrice(products).toLocaleString()}</h1>
                    {
                        products.length > 0 &&
                        <button onClick={buyNow} className="w-fit bg-green-500 text-white px-4 py-2 rounded mt-4 font-semibold hover:bg-rose-600">
                            <i className="ri-shopping-bag-4-line mr-2"></i>
                            Buy Now
                        </button>
                    }
                </div>

            </div>
        </Layout>
    )
}

export default Cart
