import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createPDFNode } from "./nodes/PDFNode";
import { $createParagraphNode, $insertNodes } from "lexical";

const PDFToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const insertPDF = (src, title = "") => {
    editor.update(() => {
      const rootElement = editor.getRootElement();
      // const editorWidth = rootElement?.getBoundingClientRect().width;
      const pdfNode = $createPDFNode({
        src,
        title,
        width: 600,
        height: 400,
      });
      $insertNodes([pdfNode]);

      if (pdfNode.getNextSibling() === null) {
        const paragraph = $createParagraphNode();
        pdfNode.insertAfter(paragraph);
      }

      pdfNode.selectNext();
    });
  };

  return (
    <button
      onClick={() => {
        const url = prompt("Enter PDF URL");
        if (url) {
          insertPDF(url, "A user-inserted PDF");
        }
      }}
      className={`px-2 py-1 bg-blue-100 hover:bg-blue-200`}
    >
      Insert PDF
    </button>
  );
};

export default PDFToolbarPlugin;
