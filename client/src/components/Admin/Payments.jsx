import { useEffect, useState } from "react"
import Layout from "./Layout"
import axios from "axios"
import moment from "moment"

const Payments= () => {
    const [payments, setPayments] = useState([])

    useEffect(() => {
        const req = async () => {
            try {
                const {data} = await axios.get("http://localhost:8080/payments")
                setPayments(data.items)
            }
            catch (err)
            {
                console.log(err)
            }
        }

        req()
    }, [])

    console.log(payments)

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-xl font-semibold">Payments</h1>
                <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-rose-600 text-white text-left">
                                <th className="p-7">Payment id</th>
                                <th>Customers's Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                payments.map((item, index) => (
                                    <tr key={index} style={{
                                        background: (index + 1) % 2 === 0 ? '#F1F5F9' : 'white'
                                    }}>
                                        <td>{item.id}</td>
                                        <td className="capitalize px-4 py-2">
                                            <div className="flex gap-3 item-center">
                                                <img
                                                    src="/images/avt.avif" className="w-10 h-10 rounded-full" />
                                                   <div className="flex flex-col justify-center">
                                                    <span className="font-semibold">{item.notes.name ? item.notes.name : "user"}</span>
                                                    <small className="text-gray-500">{item.date}</small>
                                                    </div>
                                            </div>
                                        </td>
                                        <td>{item.email}</td>
                                        <td>{item.contact}</td>
                                        <td>{item.description}</td>
                                        <td>₹{item.amount.toLocaleString()}</td>
                                        <td>{moment.unix(item.created_at).format("DD MMM YYYY HH:mm:ss")}</td>
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

export default Payments