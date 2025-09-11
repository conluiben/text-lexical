import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $insertNodes, $isParagraphNode } from "lexical";
import { $createImageNode } from "./nodes/ImageNode";

const ImageToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const insertImage = (src, alt = "") => {
    const uploadedImg = new Image();
    uploadedImg.src = src;
    uploadedImg.onload = () => {
      editor.update(() => {
        const rootElement = editor.getRootElement();
        const editorWidth = rootElement?.getBoundingClientRect().width;
        const imgScale = Math.min(1, editorWidth / uploadedImg.width);
        console.log("rootElement", rootElement);
        console.log("editorWidth:", editorWidth);
        const imageNode = $createImageNode({
          src,
          alt,
          width: Math.round(uploadedImg.width * imgScale),
          height: Math.round(uploadedImg.height * imgScale),
        });
        $insertNodes([imageNode]);

        if (imageNode.getNextSibling() === null) {
          const paragraph = $createParagraphNode();
          imageNode.insertAfter(paragraph);
        }

        imageNode.selectNext();
      });
    };

    // ? approach: create paragraph node after inserting image (working!)
    // editor.update(() => {
    //   const imageNode = $createImageNode({ src, alt });
    //   $insertNodes([imageNode]);

    //   // Ensure there's always a paragraph after the image
    //   if (imageNode.getNextSibling() === null) {
    //     const paragraph = $createParagraphNode();
    //     imageNode.insertAfter(paragraph);
    //   }

    //   imageNode.selectNext();
    // });
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
