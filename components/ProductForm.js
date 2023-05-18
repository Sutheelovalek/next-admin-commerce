/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProduct, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { 
      title, description, price, images, category, 
      properties: productProperties };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
      setGoToProducts(true);
    } else {
      //create
      const response = await axios.post("/api/products", data);
      console.log(response.data); // do something with the response data
      setGoToProducts(true);
      // wait for the state to update before redirecting
    }
  }
  if (goToProduct) {
    router.push("/products");
  }
  //upload image
  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const res = await axios.post("/api/upload", data);
        setImages((oldImages) => {
          return [...oldImages, ...res.data.links];
        });
        setIsUploading(false);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  //update image order
  function updateImagesOrder(images) {
    setImages(images);
  }
  
  const propertiesToFill = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
  
    if (catInfo && catInfo.properties) {
      propertiesToFill.push(...catInfo.properties);
    }
  
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
  
      if (parentCat && parentCat.properties) {
        propertiesToFill.push(...parentCat.properties);
        catInfo = parentCat;
      } else {
        break; // Break the loop if parentCat or its properties are undefined
      }
    }
  }
  
  

  return (
    <>
      <form onSubmit={saveProduct}>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <label>Category</label>
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
        >
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p) => (
            <div className="" key={p.name}>
              <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
              <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              </div>
            </div>
          ))}

        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable
            className="flex flex-wrap gap-2"
            list={images}
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((link, index) => (
                <div key={index} className="h-24 bg-white p-4 shadow-sm">
                  <img src={link} alt="" className="rounded-lg" />
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="p-1 h-24 flex items-center bg-blue-700">
              <Spinner />
            </div>
          )}
          <label className="cursor-pointer w-24 h-24 text-center flex flex-col items-center 
          justify-center text-gray-500 rounded-sm bg-white shadow-sm border border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Upload</div>
            <input onChange={uploadImage} className="hidden" type="file" />
          </label>
        </div>
        <label>Description</label>
        <textarea
          type="text"
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <label>Price (in THB)</label>
        <input
          text="text"
          placeholder="price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </>
  );
}
