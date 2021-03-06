import React, { useState, useEffect } from "react"
import Link from "next/link"
import fetch from "isomorphic-unfetch"
import { useRouter } from "next/router"
import { Button, Form, Loader, Confirm } from "semantic-ui-react"
import absoluteUrl from "next-absolute-url"

const EditProduct = ({ product }) => {
  // State for initial product props
  const [form, setForm] = useState({
    nama_produk: product.nama_produk,
    keterangan: product.keterangan,
    harga: product.harga,
    jumlah: product.jumlah,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // State for delete handler
  const [confirm, setConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const open = () => setConfirm(true)
  const close = () => setConfirm(false)

  const router = useRouter()

  useEffect(() => {
    if (isSubmitting) {
      if (Object.keys(errors).length === 0) {
        updateNote()
      } else {
        setIsSubmitting(false)
      }
    }

    if (isDeleting) {
      deleteProduct()
    }
  }, [errors, isDeleting])

  const deleteProduct = async () => {
    const productId = router.query.id
    try {
      const deleted = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      })
      router.push("/")
    } catch (err) {
      console.error(err.message)
    }
  }

  const updateNote = async () => {
    try {
      const res = await fetch(`/api/product/${router.query.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      })
      router.push("/")
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errs = validate()
    setErrors(errs)
    setIsSubmitting(true)
  }
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    close()
  }

  const validate = () => {
    let err = {}
    if (!form.nama_produk) {
      err.nama_produk = "Nama produk diperlukan"
    }
    if (!form.keterangan) {
      err.keterangan = "Keterangan diperlukan"
    }
    if (!form.harga) {
      err.harga = "Harga diperlukan"
    }
    if (!form.jumlah) {
      err.jumlah = "Jumlah diperlukan"
    }
    return err
  }

  return (
    <div className="bg-gray-200 h-screen">
      <div className=" flex flex-col justify-center max-w-screen-md mx-auto py-8 antialiased px-10 ">
        <div className="flex justify-between items-center my-8 ">
          <h1 className="text-3xl font-medium">Edit Product</h1>
          <Link href="/">
            <a className=" text-md text-gray-700 font-medium hover:text-gray-900 ">
              Back
            </a>
          </Link>
        </div>
        {isSubmitting ? (
          <Loader active inline="centered" />
        ) : (
          <>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                error={
                  errors.nama_produk
                    ? {
                        content: "Harap masukan Nama produk",
                        pointing: "below",
                      }
                    : null
                }
                type="text"
                label="Nama Produk"
                name="nama_produk"
                value={form.nama_produk}
                placeholder="Nama Produk"
                onChange={handleChange}
              />
              <Form.Input
                error={
                  errors.keterangan
                    ? { content: "Harap masukan Keterangan", pointing: "below" }
                    : null
                }
                type="text"
                label="keterangan"
                name="keterangan"
                value={form.keterangan}
                placeholder="Keterangan"
                onChange={handleChange}
              />
              <Form.Input
                error={
                  errors.nama_produk
                    ? { content: "Harap masukan harga", pointing: "below" }
                    : null
                }
                type="number"
                label="Harga"
                name="harga"
                value={form.harga}
                placeholder="Harga"
                onChange={handleChange}
              />
              <Form.Input
                error={
                  errors.nama_produk
                    ? { content: "Harap masukan jumlah", pointing: "below" }
                    : null
                }
                type="number"
                label="Jumlah"
                name="jumlah"
                value={form.jumlah}
                placeholder="Jumlah"
                onChange={handleChange}
              />
              <div className="py-4">
                <Button type="submit">Ubah Produk</Button>
              </div>
            </Form>

            <div className="delete-button ml-auto">
              <Button inverted color="red" onClick={open}>
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
      <Confirm
        open={confirm}
        onCancel={close}
        cancelButton="Not really"
        confirmButton="Yeep"
        onConfirm={handleDelete}
      />
    </div>
  )
}

EditProduct.getInitialProps = async ({ req, query: { id } }) => {
  const { origin } = absoluteUrl(req, "localhost:3000")

  const resp = await fetch(`${origin}/api/product/${id}`)
  const { data } = await resp.json()

  return { product: data }
}

export default EditProduct
