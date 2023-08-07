/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, Fragment } from "react";
import { InputForm, Select, Button, MarkDownEditor, Loading } from "../../components";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch} from "react-redux";
import { getBase64, validate } from "../../ultils/helper";
import { useEffect } from "react";
import { toast } from "react-toastify";
import icons from "../../ultils/icon";
import { createProduct } from "../../api";
import { showModal } from "../../store/categories/categoriesSlice";

const CreateProduct = () => {
  const { GrClose } = icons;
  const { categories } = useSelector((state) => state.categoriesReducer);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [payload, setPayload] = useState({
    description: "",
  });
  const [previews, setPreviews] = useState({
    thumb: null,
    images: [],
  });
  const [inValidFileds, setInvalidFields] = useState([]);
  const handleCreateProduct = async (data, e) => {
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
          formData.append("thumb", finalPayload.thumb[0]);
        }
        if (finalPayload.images) {
          for (let image of finalPayload.images)
            formData.append("images", image);
        }
        dispatch(showModal({ isShowModal: true , modalChildren: <Loading />}));
        const response = await createProduct(formData);
        dispatch(showModal({ isShowModal: false , modalChildren: null}));
        if (response.success) {
          toast.success(response.msg, { style: { color: "#000" } });
          reset();
          setPreviews({
            thumb: "",
            images: [],
          });
        } else {
          toast.error(response.msg, { style: { color: "#000" } });
        }
      }
    }
  };
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
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
      imagesPreviews.push({ name: file.name, path: base64 });
    }
    if (imagesPreviews.length > 0) {
      setPreviews((prev) => ({ ...prev, images: imagesPreviews }));
    }
  };
  const handleDeletePreviewsThumb = () => {
    setPreviews((prev) => ({ ...prev, thumb: "" }));
  };
  const handleDeletePreviewsImages = (imageName) => {
    const files = [...watch("images")];
    reset({
      images: files?.filter((el) => el.name !== imageName),
    });
    if (previews.images.some((el) => el.name === imageName))
      setPreviews((prev) => ({
        ...prev,
        images: previews.images.filter((el) => el.name !== imageName),
      }));
  };
  useEffect(() => {
    handlePreviewsThumb(watch("thumb")[0]);
  }, [watch("thumb")]);

  useEffect(() => {
    handlePreviewsImages(watch("images"));
  }, [watch("images")]);
  console.log("previews", { ...previews });
  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between item-center text-3xl font-bold px-4 border-b">
        <span>Create New Product</span>
      </h1>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                code: cate._id,
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
                ?.find((cate) => cate._id === watch("category"))
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
            <label className="font-semibold" htmlFor="thumb">
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
          {previews.images?.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {previews.images?.map((el) => (
                <Fragment key={el.name}>
                  <img
                    src={el.path}
                    alt="products"
                    className="w-[200px] object-contain"
                  />
                  <span
                    className="cursor-pointer my-2"
                    onClick={() => handleDeletePreviewsImages(el.name)}
                  >
                    <GrClose />
                  </span>
                </Fragment>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Button type="submit">Create New Products</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
