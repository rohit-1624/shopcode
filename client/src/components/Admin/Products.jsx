import { useState, useRef, useEffect } from "react"
import Layout from "./Layout"
import firebaseAppConfig from "../../util/firebase-config"
import { getFirestore, addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import Swal from "sweetalert2"

const imagesLink = "https://raw.githubusercontent.com/rohit-1624/shopcode-images/refs/heads/main/product"

const db = getFirestore(firebaseAppConfig)

const Products = () => {
   const [products, setProducts] = useState([])
   const [productModal, setProductModal] = useState(false)
   const [applyCloseAnimation, setApplyCloseAnimation] = useState(false)
   const model = {
      title: '',
      description: '',
      price: '',
      discount: '',
      imageUrl: imagesLink + '/b.jpg',
      userId : ''
   }
   const [productForm, setProductForm] = useState(model)
   const [edit, setEdit] = useState(null)

   useEffect(() => {
      const req = async () => {
         const snapshot = await getDocs(collection(db, "products"))
         const tmp = []
         snapshot.forEach((doc) => {
            const allProducts = doc.data()
            tmp.push(allProducts)
         })
         setProducts(tmp)
      }

      req()
   }, [])

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

   const handleModalClose = () => {
      setApplyCloseAnimation(true)
      setTimeout(() => {
         setProductModal(false)
      }, 700);
   }

   const handleModalOpen = () => {
      setApplyCloseAnimation(false)
      setProductModal(true)
   }

   const handleProductForm = (e) => {
      const input = e.target
      const name = input.name
      const value = input.value
      setProductForm({
         ...productForm,
         [name]: value
      })
   }

   const createProduct = async (e) => {
      try {
         e.preventDefault()
         await addDoc(collection(db, "products"), productForm)
         setProductForm(model)
         console.log(productForm)
         handleModalClose()
         new Swal({
            icon: 'success',
            title: 'Product Added !'
         })
      }
      catch (err) {
         new Swal({
            icon: 'error',
            title: 'Failed !',
            text: err.message
         })
      }
   }

   const deleteProduct = async (id) => {
      try {
         const ref = doc(db, "products", id)
         await deleteDoc(ref)
         new Swal({
            icon: "success",
            title: "product deleted"
         })
      }
      catch(err)
      {
         new Swal({
            icon: "error",
            title: "Failed to delete this product"
         })
      }
   }

   const editProduct = (item) => {
      setEdit(item)
      setProductForm(item)
      setProductModal(true)
   }

   const saveData = async (e) => {
      try {
         e.preventDefault()
         const ref = doc(db, "products", edit.id)
         await updateDoc(ref, productForm)
         setProductForm(model)
         setProductModal(false)
         setEdit(null)
      }
      catch(err)
      {
         new Swal({
            icon: "error",
            title: "Failed to update this product"
         })
      }
   }

   return (
      <Layout>
         <div className="p-6 pt-5">
            <div className="flex justify-between items-center md:px-4 px-1">
               <h1 className="text-xl font-semibold mb-3.5">Products</h1>
               <button className="bg-indigo-600 text-white rounded py-2 px-8" onClick={handleModalOpen}>
                  <i className="ri-sticky-note-add-line mr-2"></i>
                  New  Product
               </button>
            </div>
            <div className='grid md:grid-cols-4 gap-8 mt-8'>
               {
                  products.map((item, index) => (
                     <div key={index} className="bg-white shadow-lg rounded-md">
                        <img src={item.imageUrl}
                           className="rounded-t-md h-[250px]  w-full"
                        />
                        <div className="p-4">
                           <div className="flex items-center justify-between">
                           <h1 className="text-lg capitalize font-semibold">{item.title}</h1>
                           <div className="space-x-2">
                           <button onClick={() => editProduct(item)}>
                              <i className="ri-edit-box-line text-violet-600"></i>
                           </button>
                           <button onClick={() => deleteProduct(item.id)}>
                              <i className="ri-delete-bin-6-line text-rose-600"></i>
                           </button>

                           </div>
                              
                           </div>
                           <p className="text-gray-500">{item.description.slice(0, 50)}</p>
                           <div className="flex gap-2">
                              <p>₹{item.price - (item.price * item.discount) / 100}</p>
                              <del>₹{item.price}</del>
                              <label className="text-gray-600">({item.discount}% Off)</label>
                           </div>
                        </div>

                     </div>
                  ))
               }
            </div>

            {
               productModal &&
               <div className={`animate__animated ${applyCloseAnimation ? `animate__fadeOut` : `animate__fadeIn`} bg-black bg-opacity-80 absolute top-0 left-0 w-full h-full flex justify-center items-center`}>
                  <div className={`animate__animated ${applyCloseAnimation ? `animate__zoomOut` : `animate__zoomIn`} animate__faster bg-white md:w-5/12 w-10/12 h-full overflow-y-auto py-5 px-6 rounded-md border border-1 relative`}>
                     <button className="absolute top-3 right-4" onClick={() => handleModalClose()}>
                        <i className="ri-close-line"></i>
                     </button>
                     <h1 className="font-semibold text-xl">Add a product</h1>
                     <form className="grid grid-cols-2 gap-6 mt-4" onSubmit={edit ? saveData : createProduct}>
                        <input
                           required
                           type="text"
                           name="title"
                           placeholder="Enter product title here"
                           className="p-2 border border-gray-300 rounded col-span-2"
                           onChange={handleProductForm}
                           value={productForm.title}
                        />

                        <input
                           required
                           type="number"
                           name="price"
                           placeholder="Price"
                           className="p-2 border border-gray-300 rounded"
                           onChange={handleProductForm}
                           value={productForm.price}
                        />

                        <input
                           required
                           type="number"
                           name="discount"
                           placeholder="Discount"
                           className="p-2 border border-gray-300 rounded"
                           onChange={handleProductForm}
                           value={productForm.discount}
                        />

                        <textarea
                           required
                           name="description"
                           placeholder="Description"
                           className="p-2 border border-gray-300 rounded col-span-2"
                           rows={8}
                           onChange={handleProductForm}
                           value={productForm.description}
                        />

                        <input
                           required
                           type="url" // Input for the image URL
                           name="imageUrl"
                           placeholder="Image URL"
                           className="p-2 border border-gray-300 rounded col-span-2"
                           onChange={handleProductForm}
                           value={productForm.imageUrl}
                        />

                        <div>
                           <button className="bg-indigo-600 text-white rounded px-6 py-2">Submit</button>
                        </div>
                     </form>


                  </div>

               </div>

            }

         </div>

      </Layout>
   )
}

export default Products