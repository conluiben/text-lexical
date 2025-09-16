import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import { $createVideoNode, VideoNode } from "./nodes/VideoNode";
import { $wrapNodeInElement } from "@lexical/utils";

export const INSERT_VIDEO_COMMAND = createCommand("INSERT_VIDEO_COMMAND");
export const VideoPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error("VideoNode not registered on editor");
    }
    return editor.registerCommand(
      INSERT_VIDEO_COMMAND,
      (payload) => {
        const videoNode = $createVideoNode(payload);
        $insertNodes([videoNode]);

        let wrapperElement = null;

        if ($isRootOrShadowRoot(videoNode.getParentOrThrow())) {
          // $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          wrapperElement = $wrapNodeInElement(videoNode, $createParagraphNode);
          console.log("Saw me!");
        } else {
          wrapperElement = videoNode.getParent();
          console.log("wrapper here:", wrapperElement);
        }
        wrapperElement.setFormat("center");

        if (wrapperElement.getNextSibling() === null) {
          console.log("Wrapped!");
          const paragraph = $createParagraphNode();
          wrapperElement.insertAfter(paragraph);
          paragraph.select();
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  return null;
};
