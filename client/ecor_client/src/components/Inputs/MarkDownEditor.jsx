/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";
const MarkDownEditor = ({ label, value, changeValue, name, inValidFileds, setInvalidFields}) => {
  return (
    <div className="flex flex-col">
    <span>{label}</span>
      <Editor
        apiKey="qp3ghxkh4w3eptx9vlmdj8hwzxazqutxtkjrhro0f4hf6lim"
        initialValue={value}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={(e) => changeValue(prev => ({...prev, [name]: e.target.getContent()}))}
        onFocus={() => setInvalidFields && setInvalidFields([])}
      />
      {inValidFileds?.some(el => el.name === name) 
      &&
      <span className="text-main text-sm">
        {inValidFileds?.find(el => el.name === name)?.mes}
      </span> 
      }
    </div>
  );
};
MarkDownEditor.propTypes = {
    label:  PropTypes.string,
    changeValue: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
    inValidFileds: PropTypes.array,
    setInvalidFields: PropTypes.func
}
export default memo(MarkDownEditor);
