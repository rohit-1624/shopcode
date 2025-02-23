import { useEffect, useState } from "react"
import firebaseAppConfig from "../util/firebase-config"
import { onAuthStateChanged, getAuth, updateProfile } from "firebase/auth"
// import { getStorage, ref, uploadBytes } from "firebase/storage"
import { Navigate, useNavigate } from "react-router-dom"
import Layout from "./Layout"
import Swal from "sweetalert2"
import { getFirestore, collection, addDoc, where, query, getDocs, doc, updateDoc } from "firebase/firestore"

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig)

//not working - because firebase storage has become paid
// const storage = getStorage()
// const bucket = ref(storage)

const Profile = () => {
    const [orders, setOrders] = useState([])
    const navigate = useNavigate()
    const [session, setSession] = useState(null)
    const [isAddress, setIsAddress] = useState(false)
    const [docId, setDocId] = useState(null)
    const [isUpdated, setIsUpdated] = useState(false)
    const [formValue, setFormValue] = useState({
        fullname: '',
        email: ''
    })

    const [addressFormValue, setAddressFormValue] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        mobile: '',
        userId: ''
    })

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user)
            }
            else {
                setSession(false)
                navigate("/login")
            }
        })
    }, [])

    useEffect(() => {
        const req = async () => {
            if (session) {
                setFormValue({
                    ...formValue,
                    fullname: session.displayName,
                    mobile: (session.phoneNumber ? session.phoneNumber : '')
                })
                setAddressFormValue({
                    ...addressFormValue,
                    userId: session.uid
                })

                //fetching address
                const ref = collection(db, "addresses")
                const q = query(ref, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)

                setIsAddress(!snapshot.empty)

                snapshot.forEach((doc) => {
                    setDocId(doc.id)
                    const address = doc.data()
                    setAddressFormValue({
                        ...addressFormValue,
                        ...address
                    })
                })

            }
        }
        req()
    }, [session, isUpdated])

    useEffect(() => {
        const req = async () => {
            if(session)
            {
                const col = collection(db, "orders")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                const tmp = []
                snapshot.forEach((doc) => {
                    tmp.push(doc.data())
                })
                setOrders(tmp)
            }
        }

        req()
    }, [session])


    //firebase storage
    const setProfilePicture = (e) => {
        const input = e.target
        const file = input.files[0]
        // console.log(file)
    }

    const handleFormValue = (e) => {
        const input = e.target
        const name = input.name
        const value = input.value
        setFormValue({
            ...formValue,
            [name]: value
        })
    }

    const saveProfileInfo = async (e) => {
        e.preventDefault()
        await updateProfile(auth.currentUser, {
            displayName: formValue.fullname,
            phoneNumber: formValue.mobile
        })
        new Swal({
            icon: 'success',
            title: 'Profile saved'
        })
    }

    const setAddress = async (e) => {
        try {
            e.preventDefault()
            await addDoc(collection(db, "addresses"), addressFormValue)
            setIsAddress(true)
            setIsUpdated(!isUpdated)
            new Swal({
                icon: 'success',
                title: 'Address Saved !'
            })
        }
        catch (err) {
            new Swal({
                icon: 'error',
                title: 'Failed',
                text: err.message
            })
            console.log(err)
        }
    }

    const updateAddress = async (e) => {
        try {
            e.preventDefault()
            const ref = doc(db, "addresses", docId)
            await updateDoc(ref, addressFormValue)
            setIsUpdated(!isUpdated)
            new Swal({
                icon: "success",
                title: "Address updated !"
            })
        }
        catch (err) {
            new Swal({
                icon: 'error',
                title: 'Failed',
                text: err.message
            })
            console.log(err)
        }
    }

    const handleAddressFormValue = (e) => {
        const input = e.target
        const name = input.name
        const value = input.value
        setAddressFormValue({
            ...addressFormValue,
            [name]: value
        })
    }

    const getStatusColor = (status) => {
        const colors = {
            processing: "bg-blue-600",
            pending: "bg-indigo-600",
            dispatched: "bg-rose-600",
            returned: "bg-orange-600",
        };
    
        return colors[status] || "bg-cyan-600"; // Default color
    };
    


    if (session === null)
        return (
            <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
                <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
                </span>
            </div>
        )

    return (
        <Layout>
             <div className="mx-auto md:my-16 shadow-lg rounded-md p-8 md:w-7/12 border space-y-4">
                <div className="flex gap-3 mb-8">
                    <i className="ri-shopping-cart-line text-4xl"></i>
                    <h1 className="text-3xl font-semibold">Orders</h1>
                </div>

                <hr className="my-6" />

                {
                    orders.map((item, index) => (
                        <div  className="flex gap-3" key={index}>
                            <img src={item.imageUrl} className="w-[100px]" />
                            <div>
                                <h1 className="capitalize font-bold text-xl">{item.title}</h1>
                                <p className="text-gray-600">{item.description?.slice(0, 50) || ""}</p>
                               <div className="space-x-2">
                                <label className="font-bold text-lg">
                                    ₹{item.price - (item.price * item.discount)/100}
                                </label>
                                <del>₹{item.price}</del>
                                <label>({item.discount}% Off)</label>
                               </div>
                               <button className={`mt-2 ${getStatusColor(item.status)} text-white rounded px-3 py-1 text-xs font-medium capitalize`}>
                                {item.status ? item.status : "pending"}
                               </button>
                            </div>
                        </div>
                    ))
                }
            </div>


            <div className="mx-auto md:my-16 shadow-lg rounded-md p-8 md:w-7/12 border">
                <div className="flex gap-3">
                    <i className="ri-user-line text-4xl"></i>
                    <h1 className="text-3xl font-semibold">Profile</h1>
                </div>

                <hr className="my-6" />

                <div className="w-24 h-24 mx-auto relative mb-5">
                    <img src="/images/avt.avif" className="rounded w-24 h-24 mb-12" />
                    <input
                        type="file" accept="image/*"
                        className="opacity-0 absolute top-0 left-0 w-full h-full"
                        onChange={setProfilePicture}
                    />
                </div>

                <form className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">Fullname</label>
                        <input
                            onChange={handleFormValue}
                            required
                            name="fullname"
                            className="p-2 rounded border border-gray-300"
                            value={formValue.fullname}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">Email</label>
                        <input
                            disabled
                            onChange={handleFormValue}
                            required
                            name="email"
                            type="email"
                            className="p-2 rounded border border-gray-300"
                            value={session.email}
                        />
                    </div>

                    <button className="w-fit py-2 px-4 bg-rose-600 rounded text-white hover:bg-green-600" onClick={saveProfileInfo}>
                        <i className="ri-save-line mr-2" ></i>
                        Save
                    </button>
                </form>
            </div>


            <div className="mx-auto md:my-16 shadow-lg rounded-md p-8 md:w-7/12 border">
                <div className="flex gap-3">
                    <i className="ri-link-unlink-m text-4xl"></i>
                    <h1 className="text-3xl font-semibold">Delivery Address</h1>
                </div>

                <hr className="my-6" />
                <form className="grid grid-cols-2 gap-6" onSubmit={isAddress ? updateAddress : setAddress}>
                    <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-lg font-semibold">Area/Street/Vill.</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="address"
                            type="text"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.address}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">City</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="city"
                            type="text"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.city}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">State</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="state"
                            type="text"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.state}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">Country</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="country"
                            type="text"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.country}
                        />
                    </div>

                    <div className="flex flex-col gap-2" id="address">
                        <label className="text-lg font-semibold">Pincode</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="pincode"
                            type="number"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.pincode}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">Mobile</label>
                        <input
                            onChange={handleAddressFormValue}
                            // required
                            name="mobile"
                            type="number"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.mobile}
                        />
                    </div>

                    <div>

                    </div>

                    {
                        !isAddress ?
                            <button className="w-fit py-2 px-4 bg-green-600 rounded text-white hover:bg-rose-600">
                                <i className="ri-save-line mr-2" ></i>
                                Submit
                            </button>
                            :
                            <button className="w-fit py-2 px-4 bg-rose-600 rounded text-white hover:bg-green-600">
                                <i className="ri-save-line mr-2" ></i>
                                Save
                            </button>
                    }

                </form>
            </div>
        </Layout>
    )
}

export default Profile