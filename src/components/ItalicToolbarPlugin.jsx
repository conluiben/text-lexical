import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { useCallback, useEffect, useState } from "react";

const ItalicToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsItalic(selection.hasFormat("italic"));
        }
      });
    });
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [editor]);

  return (
    <button
      onClick={toggleItalic}
      className={`px-2 py-1 ${isItalic ? "bg-blue-200" : "bg-blue-100"}`}
    >
      I
    </button>
  );
};

export default ItalicToolbarPlugin;
