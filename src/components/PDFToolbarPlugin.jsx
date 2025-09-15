import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createPDFNode } from "./nodes/PDFNode";
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_UP_COMMAND,
} from "lexical";
import { $wrapNodeInElement } from "@lexical/utils";
import { useEffect } from "react";

const PDFToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const insertPDF = (src, title = "") => {
    editor.update(() => {
      const rootElement = editor.getRootElement();
      let wrapperElement = null;
      // const editorWidth = rootElement?.getBoundingClientRect().width;
      const pdfNode = $createPDFNode({
        src,
        title,
        width: 100,
        height: 400,
      });
      $insertNodes([pdfNode]);

      if ($isRootOrShadowRoot(pdfNode.getParentOrThrow())) {
        // $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        wrapperElement = $wrapNodeInElement(pdfNode, $createParagraphNode);
        console.log("Saw me!");
      } else {
        wrapperElement = pdfNode.getParent();
        console.log("wrapper here:", wrapperElement);
      }
      wrapperElement.setFormat("center");

      if (wrapperElement.getNextSibling() === null) {
        console.log("Wrapped!");
        const paragraph = $createParagraphNode();
        wrapperElement.insertAfter(paragraph);
        paragraph.select();
      }
    });
  };

  useEffect(() => {
    return editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (event) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
          const anchor = selection.anchor.getNode();
          const topLevel = anchor.getTopLevelElement();
          const prev = topLevel.getPreviousSibling();
          console.log("anchor:", anchor);
          console.log("topLevel:", topLevel);
          console.log("prev:", prev);

          // $nodesOf
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

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
