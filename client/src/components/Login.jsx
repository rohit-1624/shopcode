import { useState } from "react"
import firebaseAppConfig from "../util/firebase-config"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"

const auth = getAuth(firebaseAppConfig)

const Login = () => {
    const navigate = useNavigate()
    const [passwordType, setPasswordType] = useState("password") 
    const [error, setError] = useState(null)
    const [loader, setLoader] = useState(false)
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    })

    const login = async (e) => {
        try{
        e.preventDefault()
        setLoader(true)
        const user = await signInWithEmailAndPassword(auth, formValue.email, formValue.password)
        navigate("/")
        }
        catch(err)
        {
            setError("Invalid credentials provided")
        }
        finally {
            setLoader(false)
        }
    }

    const handleChange = (e) => {
        const input = e.target
        const name = input.name
        const value = input.value
        console.log(name,value)
        setFormValue({
            ...formValue,
            [name]: value
        })
        setError(null)
    }



    return (
        <div className="grid md:grid-cols-2 md:h-screen md:overflow-hidden animate__animated animate__fadeIn">
            <img src="/images/signup.jpg" className="w-full md:h-full h-40 object-cover p-5"/>
            <div className="flex flex-col md:p-16 p-8">
                <h1 className="text-4xl font-bold">Signin</h1>
                <p className="text-lg text-gray-600">Enter profile details to login</p>
                <form className="mt-8 space-y-6" onSubmit={login}>
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">E-mail</label>
                        <input 
                        onChange={handleChange}
                           required
                           type="email"
                           name="email"
                           placeholder="example@email.com"
                           className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col relative">
                        <label className="font-semibold text-lg mb-1">Password</label>
                        <input 
                        onChange={handleChange}
                           required
                           type={passwordType}
                           name="password"
                           placeholder="********"
                           className="p-3 border border-gray-300 rounded"
                        />
                        <button onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")} type="button" className="absolute top-11 right-4 w-8 h-8 rounded-full hover:bg-blue-200 hover:text-blue-600">
                            {
                                passwordType === "password" ?
                                <i className="ri-eye-line"></i>
                                :
                                <i className="ri-eye-off-line"></i>
                            }
                            
                        </button>
                    </div>

                    {
                        loader ?
                            <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-rose-600">
                                <h1><i className="ri-loader-line animate__animated animate__rotateOutDownLeft"></i></h1>
                            </button>
                            :
                            <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-rose-600">Login</button>
                    }


                </form>

                <div className="mt-2">
                    Don't have an account ? <Link to="/signup" className="text-blue-600 font-semibold">Register now</Link>
                </div>

                {
                    error &&
                    <div className="flex justify-between items-center mt-2 bg-rose-600 p-3 rounded shadow text-white font-semibold animate__animated animate__pulse">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Login
