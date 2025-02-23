import { useEffect, useState } from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../../util/firebase-config"
import { getFirestore, doc, getDocs, collection } from "firebase/firestore"
import moment from "moment"

const db = getFirestore(firebaseAppConfig)

const Customers = () => {
    const [customers, setCustomers] = useState([])

    useEffect(() => {
            const req = async () => {
                try{
                    const snapshot = await getDocs(collection(db, "customers"))
                    const tmp = []
                    snapshot.forEach((doc) => {
                        const document = doc.data()
                        document.id = doc.id
                        tmp.push(document)
                    })
                    setCustomers(tmp)
                }
                catch(err)
                {
                    console.log(err)
                }
            }
            req()
        }, [])

        console.log(customers)

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-xl font-semibold">Customers</h1>
                <div className="mt-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-rose-600 text-white text-left">
                                <th className="p-4">Customer's Name</th>
                                <th>Email</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                customers.map((item, index) => (
                                    <tr key={index} style={{
                                        background: (index + 1) % 2 === 0 ? '#F1F5F9' : 'white'
                                    }}>
                                        <td className="capitalize px-4 py-2">
                                            <div className="flex gap-3 item-center">
                                                <img
                                                    src="/images/avt.avif" className="w-10 h-10 rounded-full" />
                                                   <div className="flex flex-col justify-center">
                                                    <span className="font-semibold">{item.customerName}</span>
                                                    <small className="text-gray-500">{item.createdAt ? moment(item.createdAt.toDate()).format("DD MMM YYYY, hh:mm:ss A") : "N/A"}</small>
                                                    </div>
                                            </div>
                                        </td>
                                        <td>{item.email}</td>
                                        <td>{item.createdAt ? moment(item.createdAt).format("DD MMM YYYY, hh:mm:ss A") : "N/A"}</td>

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

export default Customers