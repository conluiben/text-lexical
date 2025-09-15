import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";
import { INSERT_VIDEO_COMMAND } from "./VideoPlugin";

const VideoToolbarPlugin = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [editor] = useLexicalComposerContext();

  const detectProvider = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }
    if (url.includes("vimeo.com")) {
      return "vimeo";
    }
    return null;
  };

  return (
    <button
      onClick={() => {
        const url = prompt("Enter Video URL");
        if (url) {
          editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
            src: url,
            provider: detectProvider(url),
            title: "Hello world",
          });
        }
      }}
      className={`px-2 py-1 bg-orange-100 hover:bg-orange-200`}
    >
      Insert Video
    </button>
  );
};

export default VideoToolbarPlugin;
