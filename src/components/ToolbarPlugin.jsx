import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { Divider } from "./ui/Divider";
import { DropDown, DropDownItem } from "./ui/Dropdown";
import {
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa6";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useReducer, useState } from "react";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [textFormatProps, setTextFormatProps] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    highlight: false,
    code: false,
  });

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        const newTextFormatProps = {};
        if ($isRangeSelection(selection)) {
          for (let key in textFormatProps) {
            if (textFormatProps.hasOwnProperty(key)) {
              newTextFormatProps[key] = selection.hasFormat(key);
            }
          }
          setTextFormatProps(newTextFormatProps);
          console.log("newTextFormatProps:", newTextFormatProps);
        }
      });
    });
  }, [editor]);

  return (
    <div className="flex items-stretch p-2">
      <DropDown buttonLabel="Insert" buttonClassName="toolbar-item">
        <DropDownItem
          className="item"
          onClick={() => console.log("Insert Image")}
        >
          Insert Image
        </DropDownItem>
        <DropDownItem
          className="item"
          onClick={() => console.log("Insert Video")}
        >
          Insert Video
        </DropDownItem>
      </DropDown>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        title="Bold"
        className={`toolbar-item ${textFormatProps.bold && "active-format"}`}
        aria-label="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        title="Italic"
        className={`toolbar-item ${textFormatProps.italic && "active-format"}`}
        aria-label="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        title="Underline"
        className={`toolbar-item ${
          textFormatProps.underline && "active-format"
        }`}
        aria-label="Underline"
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        title="Strikethrough"
        className={`toolbar-item ${
          textFormatProps.strikethrough && "active-format"
        }`}
        aria-label="Strikethrough"
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        }}
        title="Highlight"
        className={`toolbar-item ${
          textFormatProps.highlight && "active-format"
        }`}
        aria-label="Highlight"
      >
        <FaHighlighter />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
        title="Code"
        className={`toolbar-item ${textFormatProps.code && "active-format"}`}
        aria-label="Code"
      >
        <FaCode />
      </button>
    </div>
  );
};

export default ToolbarPlugin;
