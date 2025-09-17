import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $insertNodes,
  $isParagraphNode,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { $createImageNode, ImageNode } from "./nodes/ImageNode";
import { useEffect } from "react";
import { $wrapNodeInElement } from "@lexical/utils";

export const INSERT_IMAGE_COMMAND = createCommand("INSERT_IMAGE_COMMAND");
export const ImagePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImageNode not registered on editor");
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        insertImage(payload.src, payload.alt);
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const insertImage = (src, alt = "") => {
    const imageNode = $createImageNode({
      src,
      alt,
      width: 100,
    });
    $insertNodes([imageNode]);

    let wrapperElement = null;

    if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
      // $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
      wrapperElement = $wrapNodeInElement(imageNode, $createParagraphNode);
    } else {
      wrapperElement = imageNode.getParent();
    }
    wrapperElement.setFormat("center");

    if (imageNode.getNextSibling() === null) {
      const paragraph = $createParagraphNode();
      imageNode.insertAfter(paragraph);
    }
    imageNode.selectNext();
    return true;
  };

  return null;
};
