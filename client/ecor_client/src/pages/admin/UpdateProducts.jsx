/* eslint-disable react-refresh/only-export-components */
import { memo, useState, useEffect, useCallback, Fragment } from "react";
import PropTypes from "prop-types";
import {
  InputForm,
  Select,
  Button,
  MarkDownEditor,
  Loading,
} from "../../components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { getBase64, validate } from "../../ultils/helper";
import { toast } from "react-toastify";
import icons from "../../ultils/icon";
import { showModal } from "../../store/categories/categoriesSlice";
import { updateProduct } from "../../api";

const UpdateProducts = ({ editProduct, render, setEditProduct }) => {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const { GrClose } = icons;
  const { categories } = useSelector((state) => state.categoriesReducer);
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    description: "",
  });
  const [previews, setPreviews] = useState({
    thumb: null,
    images: [],
  });
  const [inValidFileds, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload]
  );
  const handlePreviewsThumb = async (file = "") => {
    const base64Thumb = await getBase64(file);
    setPreviews((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  const handlePreviewsImages = async (files = "") => {
    const imagesPreviews = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpg") {
        toast.warning("File not supported", { style: { color: "#000" } });
        return;
      }
      const base64 = await getBase64(file);
      imagesPreviews.push(base64);
    }
    if (imagesPreviews.length > 0) {
      setPreviews((prev) => ({ ...prev, images: imagesPreviews }));
    }
  };
  const handleDeletePreviewsThumb = () => {
    setPreviews((prev) => ({ ...prev, thumb: "" }));
  };
  const handleDeletePreviewsImages = (image) => {
    const files = [...watch("images")];
    reset({
      images: files?.filter((el) => el !== image),
    });
    if (previews.images.some((el) => el === image))
      setPreviews((prev) => ({
        ...prev,
        images: previews.images.filter((el) => el !== image),
      }));
  };
  const handleUpdateProduct = async (data, e) => {
    e.preventDefault();
    const invalids = validate(payload, setInvalidFields);
    if (invalids == 0) {
      if (data.category) {
        data.category = categories?.find(
          (el) => el._id === data.category
        )?.title;
        const finalPayload = { ...data, ...payload };
        const formData = new FormData();
        for (let i of Object.entries(finalPayload)) {
          formData.append(i[0], i[1]);
        }
        if (finalPayload.thumb) {
          formData.append(
            "thumb",
            data.thumb.length === 0 ? previews.thumb : finalPayload.thumb[0]
          );
        }
        if (finalPayload.images) {
          const images =
            finalPayload.images.length === 0
              ? previews.images
              : finalPayload.images;
          for (let image of images) formData.append("images", image);
        }
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
        const response = await updateProduct(formData, editProduct._id);
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
          toast.success(response.msg, { style: { color: "#000" } });
          render();
          setPreviews({
            thumb: "",
            images: [],
          });
          setEditProduct(null);
        } else {
          toast.error(response.msg, { style: { color: "#000" } });
        }
      }
    }
  };

  
  useEffect(() => {
    reset({
      title: editProduct.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category || "",
      brand: editProduct?.brand || "",
    });
    setPayload({
      description:
        typeof editProduct?.description === "object"
          ? editProduct?.description?.join(", ")
          : editProduct?.description,
    });
    setPreviews({
      thumb: editProduct?.thumb || "",
      images: editProduct?.images || [],
    });
  }, [editProduct, reset]);

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
      handlePreviewsThumb(watch("thumb")[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("thumb")]);

  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0) {
      handlePreviewsImages(watch("images"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("images")]);
  console.log("file", previews);
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="px-4 border-b bg-gray-100 flex justify-between items-center fixed top-0 right-0 left-[327px]">
        <h1 className="text-3xl font-bold tracking-tight">Cập nhập sản phẩm</h1>
        <span
          className="text-main hover:underline cursor-pinter"
          onClick={() => setEditProduct(null)}
        >
          <Button>Quay trở lại</Button>
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputForm
            label="Name product"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: `Need fill this field`,
            }}
            fullWidth
            placeholder="Name of product"
          />
          <div className="w-full my-6 flex gap-4">
            <InputForm
              label="Price"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: `Need fill this field`,
              }}
              fullWidth
              placeholder="price of new product"
              type="number"
              style="flex-auto"
            />

            <InputForm
              label="Quantity"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: `Need fill this field`,
              }}
              fullWidth
              placeholder="Quantity of the new product"
              type="number"
              style="flex-auto"
            />

            <InputForm
              label="Color"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: `Need fill this field`,
              }}
              fullWidth
              placeholder="Color of the new product"
              type="text"
              style="flex-auto"
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Category"
              id="category"
              options={categories?.map((cate) => ({
                code: cate.title,
                value: cate.title,
              }))}
              register={register}
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
            <Select
              label="Brand (Optional)"
              id="brand"
              disable={watch("category") ? false : true}
              options={categories
                ?.find(
                  (cate) =>
                    cate?.title?.toLowerCase() ===
                    watch("category")?.toLowerCase()
                )
                ?.brand?.map((brand) => ({
                  code: brand,
                  value: brand,
                }))}
              register={register}
              validate={{
                required: "Need fill this field",
              }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
          </div>
          <MarkDownEditor
            name="description"
            changeValue={changeValue}
            label="Description"
            inValidFileds={inValidFileds}
            setInvalidFields={setInvalidFields}
            value={payload?.description}
          />
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Upload thumb
            </label>
            <input
              type="file"
              id="thumb"
              {...register("thumb", { required: `Need choose` })}
            />
            {errors["thumb"] && (
              <small className="text-xs text-red-500">
                {errors["thumb"].message}
              </small>
            )}
          </div>
          {previews.thumb && (
            <div className="my-4 flex">
              <img
                src={previews.thumb}
                alt="thumbnail"
                className="w-[200px] object-contain"
              />
              <span
                className="cursor-pointer my-2"
                onClick={handleDeletePreviewsThumb}
              >
                <GrClose />
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="images">
              Upload images of Product
            </label>
            <input
              type="file"
              id="images"
              multiple
              {...register("images", { required: `Need choose` })}
            />
            {errors["images"] && (
              <small className="text-xs text-red-500">
                {errors["images"].message}
              </small>
            )}
          </div>
          {previews?.images?.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {previews?.images?.map((el, index) => (
                <Fragment key={index}>
                  <img
                    src={el}
                    alt="products"
                    className="w-[200px] object-contain"
                  />
                  <span
                    className="cursor-pointer my-2"
                    onClick={() => handleDeletePreviewsImages(el)}
                  >
                    <GrClose />
                  </span>
                </Fragment>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Button type="submit">Updated Products</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
UpdateProducts.propTypes = {
  editProduct: PropTypes.bool,
  render: PropTypes.func,
  setEditProduct: PropTypes.setEditProduct,
};
export default memo(UpdateProducts);
