/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useState, memo, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { InputForm, Button, Loading } from "../../components";
import { useForm } from "react-hook-form";
import icon from "../../ultils/icon";
import { getBase64 } from "../../ultils/helper";
import { toast } from "react-toastify";
import { addVariants } from "../../api";
import { showModal } from "../../store/categories/categoriesSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
const CustomizeVariants = ({
  customizevariants,
  setCustomizeVariants,
}) => {
  const { GrClose } = icon;
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm();
  const [previews, setPreviews] = useState({
    thumb: null,
    images: [],
  });
  const handleAddVariants = async (data = "") => {
    if (data.color === customizevariants.color) {
      Swal.fire(`Oop!`, `Màu sắc không thay đổi`, "info");
    } else {
      const formData = new FormData();
      for (let i of Object.entries(data)) {
        formData.append(i[0], i[1]);
      }
      if (data.thumb) {
        formData.append("thumb", data?.thumb[0]);
      }
      if (data.images) {
        for (let image of data.images) formData.append("images", image);
      }
      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await addVariants(customizevariants._id, formData);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));
      console.log("response", response);
      if (response.success) {
        toast.success(response.mes, { style: { color: "#000" } });
        reset();
        setPreviews({
          thumb: "",
          images: [],
        });
      } else {
        toast.error(response.mes, { style: { color: "#000" } });
      }
    }
  };
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
    reset({
      title: customizevariants?.title,
      color: customizevariants?.color,
      price: customizevariants?.price,
    });
  }, [customizevariants, reset]);
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
  console.log(`previews`, previews);
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="px-4 border-b bg-gray-100 flex justify-between items-center fixed top-0 right-0 left-[327px]">
        <h1 className="text-3xl font-bold tracking-tight">
          Tùy chỉnh biến thể sản phẩm
        </h1>
        <span
          className="text-main hover:underline cursor-pinter"
          onClick={() => setCustomizeVariants(null)}
        >
          <Button>Quay trở lại</Button>
        </span>
      </div>

      <form
        className="p-4 w-full flex flex-col gap-4"
        onSubmit={handleSubmit(handleAddVariants)}
      >
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Original name"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: `Need fill this field`,
            }}
            fullWidth
            placeholder="Title of variants"
            style="flex-auto"
            disabled={false}
          />
        </div>
        <div className="flex gap-4 items-center w-full">
          <InputForm
            label="Price Variants"
            register={register}
            errors={errors}
            id="price"
            validate={{
              required: `Need fill this field`,
            }}
            fullWidth
            placeholder="Price of variants"
            type="number"
            style="flex-auto"
          />
          <InputForm
            label="Color Variants"
            register={register}
            errors={errors}
            id="color"
            validate={{
              required: `Need fill this field`,
            }}
            fullWidth
            placeholder="Color of variants"
            type="text"
            style="flex-auto"
          />
        </div>
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
          <Button type="submit">Add New Variants</Button>
        </div>
      </form>
    </div>
  );
};
CustomizeVariants.propTypes = {
  customizevariants: PropTypes.string,
  setCustomizeVariants: PropTypes.func,
  render: PropTypes.func,
};
export default memo(CustomizeVariants);
