import { useState } from "react";
import { Modal } from "./Modal";

const VideoModal = ({ onInsert, onClose }) => {
  const [src, setSrc] = useState("");
  const [provider, setProvider] = useState("");
  const [title, setTitle] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
    // TODO: insert input validation
    const detectProvider = (url) => {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        return "youtube";
      }
      if (url.includes("vimeo.com")) {
        return "vimeo";
      }
      return null;
    };
    if (!src.trim()) {
      alert("Please enter a valid video source.");
      return;
    }
    if (provider !== detectProvider(src)) {
      alert("Provider doesn't match source link!");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a valid alterate text to the video.");
      return;
    }
    onInsert({ src, provider, title });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Insert Video">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        <div className="form-input-row">
          <div className="form-input">
            <label htmlFor="src">Video Source</label>
            <input
              type="text"
              name="src"
              id="src"
              placeholder="Video source URL..."
              onChange={(e) => setSrc(e.target.value)}
            />
          </div>
          <div className="form-input">
            <label htmlFor="provider">Video Provider</label>
            <select
              name="provider"
              id="provider"
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </div>
        </div>
        <div className="form-input">
          <label htmlFor="title">Alternate Text</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Video description..."
            onChange={(e) => setTitle(e.target.value)}
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

export default VideoModal;
