import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import { useEffect, useState } from "react";

const AlignmentToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [alignment, setAlignment] = useState("left");
  const setEditorAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const allAlignments = ["left", "center", "right", "justify"];

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          let parent = anchorNode.getTopLevelElement(); //getTopLevelElementOrThrow
          if (!parent || parent.getType() === "root") return;
          // if (parent.getType() === "root") {
          //   parent = anchorNode.getParent();
          // }
          const align = parent.getFormatType(); // returns "left" | "right" | "center" | "justify"
          setAlignment(align || "left");
        }
      });
    });
  }, [editor]);

  return allAlignments.map((anAlignment, idx) => (
    <button
      key={idx}
      onClick={() => setEditorAlignment(anAlignment)}
      className={`px-2 py-1 ${
        anAlignment === alignment ? "bg-red-200" : "bg-red-100"
      }`}
    >
      {anAlignment.charAt(0).toUpperCase() + anAlignment.slice(1)}
    </button>
  ));
};

export default AlignmentToolbarPlugin;
