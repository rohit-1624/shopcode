import { useEffect, useState } from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../../util/firebase-config"
import { getFirestore, getDocs, collection, query, where, updateDoc, doc } from "firebase/firestore"
import Swal from "sweetalert2"
import moment from "moment"

const db = getFirestore(firebaseAppConfig)

const Orders = () => {
    const [orders, setOrders] = useState([])

    console.log(orders)
    useEffect(() => {
        const req = async () => {
            const snapshot = await getDocs(collection(db, "orders")) 
            const tmp = []
            snapshot.forEach((doc) => {
                const order = doc.data()
                order.orderId = doc.id
                tmp.push(order)
            })
            setOrders(tmp)
        }

        req()
    }, [])

    const updateOrderStatus = async(e, orderId) => {
        try {
            const status = e.target.value
            const ref = doc(db, "orders", orderId)
            await updateDoc(ref, {status: status})
            new Swal({
                icon: "success",
                title: "Order Status Updated !"
            })
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-xl font-semibold">Orders</h1>
                <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-rose-600 text-white">
                                <th className="py-4">Order Id</th>
                                <th>Customers's Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                orders.map((item, index) => (
                                    <tr key={index} className="text-center" style={{
                                        background: (index+1)%2 === 0 ? '#F1F5F9' : 'white'
                                    }}>
                                        <td className="py-4">{item.orderId}</td>
                                        <td className="capitalize">Naman</td>
                                        <td>{item.email}</td>
                                        <td>{item.address ? item.address.mobile : "Update required !"}</td>
                                        <td className="capitalize">{item.title}</td>
                                        <td>₹{item.price.toLocaleString()}</td>
                                        <td>{moment(item.createdAt.toDate()).format("DD MMM YYYY, hh:mm:ss A")}</td>
                                        <td className="capitalize">
                                            <select className="border p-1 border-gray-200" onChange={(e) => updateOrderStatus(e, item.orderId)}>
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="disatched">Dispatched</option>
                                                <option vlaue="returned">Returned</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}

export default Orders