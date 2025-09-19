"use client";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { $getSelection, $isElementNode, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { NodeEventPlugin } from "@lexical/react/LexicalNodeEventPlugin";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import BoldToolbarPlugin from "./BoldToolbarPlugin";
import ItalicToolbarPlugin from "./ItalicToolbarPlugin";
import { ImageNode } from "./nodes/ImageNode";
import ImageToolbarPlugin from "./ImageToolbarPlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import ExportButton from "./ExportButton";
import { $findMatchingParent } from "@lexical/utils";
import { LinkNode } from "@lexical/link";
import AlignmentToolbarPlugin from "./AlignmentToolbarPlugin";
import { PDFNode } from "./nodes/PDFNode";
import PDFToolbarPlugin from "./PDFToolbarPlugin";
import { VideoNode } from "./nodes/VideoNode";
import VideoToolbarPlugin from "./VideoToolbarPlugin";
import { VideoPlugin } from "./VideoPlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import { ImagePlugin } from "./ImagePlugin";
import { Modal } from "./ui/Modal";

const theme = {
  paragraph: "mb-0",
  heading: {
    h1: "text-2xl font-bold mb-3",
    h2: "text-xl font-semibold mb-2",
    h3: "text-lg font-semibold mb-2",
  },
  quote: "border-l-4 pl-3 italic opacity-90",
  list: {
    ul: "list-disc pl-6",
    ol: "list-decimal pl-6",
    listitem: "my-1",
  },
  link: "underline underline-offset-2",
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline",
    code: "rounded bg-zinc-200 px-1 py-0.5 font-mono text-[0.95em] dark:bg-zinc-800",
  },
};

function onError(error) {
  console.error(error);
}

const MyOnChangePlugin = (props) => {
  // TODO: listen for changes to the editor
  const [editor] = useLexicalComposerContext();
  const { onChange } = props;
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [onChange, editor]);
};

const HeadingPlugin = () => {
  const headings = ["h1", "h2", "h3"];
  const [editor] = useLexicalComposerContext();
  const onClick = (tag) => {
    editor.update(() => {
      // const root = $getRoot();
      // root.append(
      //   $createHeadingNode("h1").append($createTextNode("Hello World"))
      // );
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // check if range selection (one of three types)
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div>
      {headings.map((aHeading, idx) => (
        <button
          onClick={() => onClick(aHeading)}
          className="px-3 py-2 bg-orange-100 hover:bg-orange-200"
          key={idx}
        >
          {aHeading.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const ListToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeListType, setActiveListType] = useState(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        const anchorNode = selection.anchor.getNode();
        const parentList = $findMatchingParent(anchorNode, (n) =>
          $isListNode(n) ? true : $isElementNode(n) && n.getType() === "root"
        );
        if ($isListNode(parentList)) {
          setActiveListType(parentList.getTag()); // returns "ol" or "ul"
        } else {
          setActiveListType(null);
        }
      });
    });
  });

  const lists = ["ol", "ul"];
  const onClick = (tag) => {
    if (activeListType === tag) {
      // remove if already active
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      return;
    }
    if (tag === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <div>
      {lists.map((aList, idx) => (
        <button
          onClick={() => onClick(aList)}
          className={`px-3 py-2 hover:bg-green-200 ${
            activeListType === aList ? "bg-green-200" : "bg-green-100"
          }`}
          key={idx}
        >
          {aList.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
const Editor = () => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode, ImageNode, PDFNode, VideoNode],
  };
  const [htmlString, setHtmlString] = useState({ __html: "" });

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig}>
        <NodeEventPlugin
          nodeType={LinkNode}
          eventType={"click"}
          eventListener={(e) => {
            alert("Nice!");
          }}
        />
        <div className="flex flex-col rounded-lg overflow-hidden mb-8">
          {/* editor toolbar + textarea */}
          <div className="flex items-stretch justify-between bg-slate-100">
            <ToolbarPlugin />
            <ListPlugin />
            <ImagePlugin />
            <VideoPlugin />
            <div className="flex">
              {/* <HeadingPlugin />
              <ListToolbarPlugin />
              <AlignmentToolbarPlugin />
              <BoldToolbarPlugin />
              <ItalicToolbarPlugin />
              <ImageToolbarPlugin />
              <PDFToolbarPlugin />
              <VideoToolbarPlugin /> */}
            </div>
            <ExportButton updateHtml={setHtmlString} />
          </div>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="p-2 bg-slate-100 border border-slate-200 border-2"
                  aria-placeholder={"Enter some text..."}
                  placeholder={
                    <div className="absolute top-0 mt-2 ml-2">
                      Enter some text...
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <AutoFocusPlugin />
          <MyOnChangePlugin
            onChange={(editorState) => {
              console.log(editorState);
            }}
          />
        </div>
        <div className="bg-orange-50 content p-4">
          <h1 className="text-2xl font-bold mb-2">Content Preview</h1>

          <div
            dangerouslySetInnerHTML={htmlString}
            className="p-4 bg-white"
          ></div>
        </div>
      </LexicalComposer>
    </div>
  );
};

export default Editor;
