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
import { Resizable } from "re-resizable";
import { useEffect } from "react";
import { Rnd } from "react-rnd";

const ImageComponent = ({
  src,
  alt,
  nodeKey,
  width,
  height,
  alignment = "center",
}) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

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
    editor.update(() => {
      const editorWidth =
        editor.getRootElement().getBoundingClientRect().width - 16 - 4; // p-2 and b-2 editor padding
      const node = $getNodeByKey(nodeKey);
      if (node) {
        node.setWidth((ref.offsetWidth / editorWidth) * 100.0);
        node.setHeight(ref.offsetHeight);
      }
    });
  };

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    editor.update(() => {
      clearSelection();
      setSelected(true);
    });
  };

  return (
    // <div className={`flex justify-${alignment} h-full`}>
    <Resizable
      size={{ width: `${width}%`, height: "auto" }}
      defaultSize={{ height: "auto" }}
      bounds="parent"
      className={`border inline-block ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      minWidth={100}
      maxWidth="100%"
      minHeight={100}
      lockAspectRatio
      onResizeStop={onResizeStop}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="b-0 grow mx-auto w-full h-full pointer-events-auto"
      />
    </Resizable>
  );
};

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }
  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__alignment,
      node.__key
    );
  }
  static importJSON(serializedNode) {
    const { src, alt, width, height, alignment } = serializedNode;
    return new ImageNode(src, alt, width, height, alignment);
  }
  constructor(src, alt, width, height, alignment, key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width || 600;
    this.__height = height || 400;
    this.__alignment = alignment || "center";
  }
  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
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
      img: (domNode) => {
        if (domNode instanceof HTMLImageElement) {
          return {
            conversion: () => {
              return {
                node: new ImageNode(
                  domNode.getAttribute("src"),
                  domNode.getAttribute("alt"),
                  domNode.getAttribute("width"),
                  domNode.getAttribute("height"),
                  domNode.getAttribute("alignment")
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
    imgParentElement.className = "flex justify-center";

    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", this.__src);
    if (this.__alt) {
      imgElement.setAttribute("alt", this.__alt);
    }
    imgElement.style.width = this.__width + "%";
    imgElement.style.height = auto;
    imgElement.style.objectFit = "cover";
    imgElement.className = "my-4";

    imgParentElement.appendChild(imgElement);
    // return should have "element" property
    return { element: imgParentElement };
  }
  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        height={this.__height}
        alignment={this.__alignment}
        nodeKey={this.getKey()}
      />
    );
  }
  // isIsolated() {
  //   return true;
  // }

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

export function $createImageNode({ src, alt, width = 100, height = 400 }) {
  return new ImageNode(src, alt, width, height);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
