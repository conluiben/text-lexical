import { useState } from "react";
import { Modal } from "./Modal";

const ImageModal = ({ onInsert, onClose }) => {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
    // TODO: insert input validation
    if (!src.trim()) {
      alert("Please enter a valid image source.");
      return;
    }
    if (!alt.trim()) {
      alert("Please enter a valid alterate text.");
      return;
    }
    onInsert({ src, alt });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Insert Image">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        <div className="form-input">
          <label htmlFor="src">Image Source</label>
          <input
            type="text"
            name="src"
            id="src"
            placeholder="Image source URL..."
            onChange={(e) => setSrc(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="alt">Alternate Text</label>
          <input
            type="text"
            name="alt"
            id="alt"
            placeholder="Image description..."
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-200 hover:bg-blue-300 px-3 py-2 rounded-lg shadow-md"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ImageModal;
