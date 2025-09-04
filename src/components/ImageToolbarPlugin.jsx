import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createImageNode } from "./nodes/ImageNode";

const ImageToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const insertImage = (src, alt = "") => {
    editor.update(() => {
      const imageNode = $createImageNode({ src, alt });
      $insertNodes([imageNode]);
    });
  };

  return (
    <button
      onClick={() => {
        const url = prompt("Enter image URL");
        if (url) {
          insertImage(url, "A user-inserted image");
        }
      }}
      className={`px-2 py-1 bg-yellow-100 hover:bg-yellow-200`}
    >
      Insert Image
    </button>
  );
};

export default ImageToolbarPlugin;
