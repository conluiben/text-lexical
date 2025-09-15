import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $getNodeByKey,
  $getSelection,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
} from "lexical";
import Image from "next/image";
import { Resizable } from "re-resizable";
import { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

const PDFComponent = ({ src, alt, nodeKey, width, height }) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const iframeRef = useRef(null);

  useEffect(() => {
    return editor.registerCommand(
      ["delete", "backspace"],
      () => {
        if (isSelected) {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node) node.remove();
          });
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isSelected, nodeKey]);

  const onResizeStop = (e, direction, ref, delta, position) => {
    iframeRef.current.src = src;
    editor.update(() => {
      const editorWidth =
        editor.getRootElement().getBoundingClientRect().width - 16 - 4; // p-2 and b-2 editor padding
      const node = $getNodeByKey(nodeKey);
      // console.log(
      //   "Computed:",
      //   ref.offsetWidth,
      //   "/",
      //   editorWidth,
      //   "=",
      //   ref.offsetWidth / editorWidth
      // );
      if (node) {
        node.setWidth((ref.offsetWidth / editorWidth) * 100.0);
        node.setHeight(ref.offsetHeight);
      }
    });
  };

  const onClick = (e) => {
    console.log("clicked pdf");
    e.preventDefault();
    e.stopPropagation();
    editor.update(() => {
      clearSelection();
      setSelected(true);
    });
  };

  return (
    // <div className="flex justify-center h-auto">
    <Resizable
      size={{ width: `${width}%`, height: `${height}px` }}
      onClick={onClick}
      // onResize={(e, dir, ref, d) => {
      //   const widthChanging = ["right", "left", "bottomRight", "bottomLeft"];
      //   if (widthChanging.includes(dir)) {
      //     console.log("Found Dir:", dir);
      //     ref.style.width = `${ref.offsetWidth + d.width * 1}px`;
      //   }
      //   iframeRef.current.src = "";
      // }}
      onResizeStop={onResizeStop}
      minHeight={150}
      minWidth={200}
      maxWidth="100%"
      bounds="parent"
      className={`inline-block bg-blue-100 ${
        isSelected ? "ring-4 ring-blue-500" : ""
      }`}
    >
      <iframe
        ref={iframeRef}
        src={src}
        className="b-0 grow mx-auto w-full h-full pointer-events-auto"
        title="PDF Viewer"
        onClick={onClick}
      ></iframe>
    </Resizable>
    // </div>
  );
};

export class PDFNode extends DecoratorNode {
  static getType() {
    return "pdf";
  }
  static clone(node) {
    return new PDFNode(
      node.__src,
      node.__title,
      node.__width,
      node.__height,
      node.getKey()
    );
  }
  static importJSON(serializedNode) {
    const { src, title, width, height } = serializedNode;
    return new PDFNode(src, title, width, height);
  }
  constructor(src, title, width, height, key) {
    super(key);
    this.__src = src;
    this.__title = title;
    this.__width = width || 100; // in %
    this.__height = height || 400; // in px
  }
  exportJSON() {
    return {
      type: "pdf",
      version: 1,
      src: this.__src,
      title: this.__title,
      width: this.__width,
      height: this.__height,
    };
  }
  createDOM() {
    const div = document.createElement("div");
    return div;
  }
  updateDOM() {
    return false;
  }
  static importDOM() {
    return {
      iframe: (domNode) => {
        if (domNode instanceof HTMLIFrameElement) {
          return {
            conversion: () => {
              return {
                node: new PDFNode(
                  domNode.getAttribute("src"),
                  domNode.getAttribute("title"),
                  domNode.getAttribute("width"),
                  domNode.getAttribute("height")
                ),
              };
            },
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  exportDOM() {
    // can't use react components.
    const imgParentElement = document.createElement("div");
    imgParentElement.className = "inline-block text-center relative w-full";

    const imgElement = document.createElement("iframe");
    imgElement.setAttribute("src", this.__src);
    if (this.__title) {
      imgElement.setAttribute("title", this.__title);
    }
    imgElement.style.width = this.__width + "%";
    imgElement.style.height = this.__height + "px";
    imgElement.className = "b-0 grow mx-auto pointer-events-auto";

    imgParentElement.appendChild(imgElement);
    // return should have "element" property
    return { element: imgParentElement };
  }
  decorate() {
    return (
      <PDFComponent
        src={this.__src}
        title={this.__title}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
  isIsolated() {
    return true;
  }

  // Prevent merging into other nodes (common for images)
  isInline() {
    return false; // block behavior
  }
  isKeyboardSelectable() {
    return true;
  }
  canInsertTextAfter() {
    return true;
  }
  canInsertTextBefore() {
    return true;
  }
  setWidth(width) {
    this.getWritable().__width = width;
  }
  setHeight(height) {
    this.getWritable().__height = height;
  }
}

export function $createPDFNode({ src, title, width = 100, height = 400 }) {
  return new PDFNode(src, title, width, height);
}

export function $isPDFNode(node) {
  return node instanceof PDFNode;
}
