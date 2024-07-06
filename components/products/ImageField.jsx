import { useState } from "react";
import PropTypes from "prop-types";

export const ImageField = ({ oldPhoto, onPhotoSelected }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onPhotoSelected(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="sm:flex items-center gap-x-8">
      <img
        src={preview || oldPhoto}
        alt=""
        className="h-96 w-full sm:w-96 flex-none rounded-lg bg-gray-800 object-cover"
      />
      <div className="text-center mt-5">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer px-3 py-2 rounded-md text-sm bg-black/10 font-semibold text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 hover:bg-black/20"
        >
          <span>Alterar a foto</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-2 text-xs leading-5 text-gray-400">JPG, GIF or PNG.</p>
      </div>
    </div>
  );
};

ImageField.propTypes = {
  oldPhoto: PropTypes.string,
  onPhotoSelected: PropTypes.func,
};
