import Layout from "./Layout"

const Contact = () => {
    return (
        <Layout>
        <div>
            <header className="md:w-6/12 mx-auto my-16 md:shadow-lg bg-white border">
                <img src="/images/contact.jpg" className="w-full"/>
                <div className="p-8">
                <form className="mt-8 space-y-6">
                <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Fullname</label>
                        <input 
                           required
                           type="text"
                           name="fullname"
                           placeholder="Your name"
                           className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">E-mail</label>
                        <input 
                           required
                           type="email"
                           name="email"
                           placeholder="example@email.com"
                           className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Message</label>
                        <textarea
                           required
                           name="message"
                           placeholder="Enter your message here"
                           className="p-3 border border-gray-300 rounded"
                           rows={4}
                        />
                    </div>

                    <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-rose-600">Submit</button>

                </form>
                </div>
            </header>
        </div>
        </Layout>
    )
}

export default Contact