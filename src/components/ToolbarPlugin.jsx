import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { Divider } from "./ui/Divider";
import { DropDown, DropDownItem } from "./ui/Dropdown";
import {
  FaBold,
  FaCode,
  FaHighlighter,
  FaItalic,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaStrikethrough,
  FaUnderline,
} from "react-icons/fa6";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import {
  formatBulletList,
  formatHeading,
  formatNumberedList,
  formatParagraph,
} from "@/utils/lexical";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [textFormatProps, setTextFormatProps] = useState({
    blockType: "paragraph",
    blockTag: null,
    format: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      highlight: false,
      code: false,
    },
  });
  const blockOptions = [
    {
      blockType: "paragraph",
      blockTag: null,
      text: "Paragraph",
      icon: <FaParagraph />,
      formatBlock: ({ editor }) => formatParagraph(editor),
    },
    {
      blockType: "heading",
      blockTag: "h1",
      text: "Heading 1",
      icon: <LuHeading1 />,
      formatBlock: ({ editor, blockTag }) =>
        formatHeading(editor, blockTag, "h1"),
    },
    {
      blockType: "heading",
      blockTag: "h2",
      text: "Heading 2",
      icon: <LuHeading2 />,
      formatBlock: ({ editor, blockTag }) =>
        formatHeading(editor, blockTag, "h2"),
    },
    {
      blockType: "heading",
      blockTag: "h3",
      text: "Heading 3",
      icon: <LuHeading3 />,
      formatBlock: ({ editor, blockTag }) =>
        formatHeading(editor, blockTag, "h3"),
    },
    {
      blockType: "list",
      blockTag: "ol",
      text: "Numbered List",
      icon: <FaListOl />,
      formatBlock: ({ editor, blockType, blockTag }) =>
        formatNumberedList(editor, blockType, blockTag),
    },
    {
      blockType: "list",
      blockTag: "ul",
      text: "Bullet List",
      icon: <FaListUl />,
      formatBlock: ({ editor, blockType, blockTag }) =>
        formatBulletList(editor, blockType, blockTag),
    },
  ];

  const activeBlock = blockOptions.find(
    ({ blockType, blockTag }) =>
      textFormatProps.blockType === blockType &&
      textFormatProps.blockTag === blockTag
  );

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        const anchorNode = selection.anchor.getNode();
        const anchorTopLevel = anchorNode.getTopLevelElementOrThrow();

        // find block type (headings 1-3, ol/ul list, paragraph)
        const blockType = anchorTopLevel.getType();
        const blockTag =
          typeof anchorTopLevel?.getTag === "function"
            ? anchorTopLevel.getTag()
            : null;

        const newTextFormatProps = {};
        if ($isRangeSelection(selection)) {
          for (let key in textFormatProps.format) {
            if (textFormatProps.format.hasOwnProperty(key)) {
              newTextFormatProps[key] = selection.hasFormat(key);
            }
          }
          // TODO: update only when changes are found
          setTextFormatProps((prev) => ({
            ...prev,
            blockTag,
            blockType,
            format: newTextFormatProps,
          }));
        }
      });
    });
  }, [editor]);

  return (
    <div className="flex items-stretch p-2">
      <DropDown buttonIcon={activeBlock.icon} buttonLabel={activeBlock.text}>
        {blockOptions.map((aBlockOption, idx) => (
          <DropDownItem
            key={idx}
            onClick={() =>
              aBlockOption.formatBlock({
                editor,
                blockType: textFormatProps.blockType,
                blockTag: textFormatProps.blockTag,
              })
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{aBlockOption.icon}</span>
              <span>{aBlockOption.text}</span>
            </div>
          </DropDownItem>
        ))}
      </DropDown>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        title="Bold"
        className={`toolbar-item ${
          textFormatProps.format.bold && "active-format"
        }`}
        aria-label="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        title="Italic"
        className={`toolbar-item ${
          textFormatProps.format.italic && "active-format"
        }`}
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
          textFormatProps.format.underline && "active-format"
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
          textFormatProps.format.strikethrough && "active-format"
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
          textFormatProps.format.highlight && "active-format"
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
        className={`toolbar-item ${
          textFormatProps.format.code && "active-format"
        }`}
        aria-label="Code"
      >
        <FaCode />
      </button>
      <Divider />
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
    </div>
  );
};

export default ToolbarPlugin;
