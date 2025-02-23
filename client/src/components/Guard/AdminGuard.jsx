import { useEffect, useState } from "react"
import firebaseAppConfig from "../../util/firebase-config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Outlet, useNavigate, Navigate} from "react-router-dom"
import { collection, getDocs, getFirestore, query, where, doc } from "firebase/firestore"
import { useLocation } from "react-router-dom"

const db = getFirestore(firebaseAppConfig)
const auth = getAuth(firebaseAppConfig)

const AdminGuard = () => {
    const navigate = useNavigate()
    const [session, setSession] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const location = useLocation()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                setSession(user)
            }
            else
            {
                navigate("/")
            }
        })
    }, [])

    useEffect(() => {
        const req = async () => {
            if(session)
            {
                const col = collection(db, "customers")
                const q = query(col, where("userId", "==", session.uid))
                const snapshot = await getDocs(q)
                let role = null;
                snapshot.forEach((doc) => {
                    const customer = doc.data()
                    role = customer.role
                })

                if(role === "user")
                {
                    navigate("/profile")
                    return false;
                }
                else
                {
                    setIsAdmin(true)
                }
            }
        }
        req()
    }, [session])

    if(location.pathname === "/admin")
        return <Navigate to={"/admin/dashboard"} />

    if(isAdmin) return <Outlet />


    return (
        <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
            <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
            </span>
        </div>
    )
}

export default AdminGuard