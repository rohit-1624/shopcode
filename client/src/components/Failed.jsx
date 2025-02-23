import { Link } from "react-router-dom"

const Failed = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="w-6/12 text-center space-y-6">
                <img src="/images/failed.svg" className="w-8/12 mx-auto" />
                <h1 className="text-5xl font-bold">Payment Failed !</h1>
                <Link to="/" className="bg-indigo-600 px-4 py-2 rounded text-white block w-fit mx-auto">Go Back !</Link>
            </div>
        </div>
    )
}

export default Failed