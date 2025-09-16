import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $applyNodeReplacement,
  $getNodeByKey,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
} from "lexical";
import { Resizable } from "re-resizable";
import React, { useEffect } from "react";

export class VideoNode extends DecoratorNode {
  static getType() {
    return "video";
  }

  static clone(node) {
    return new VideoNode(
      {
        src: node.__src,
        provider: node.__provider,
        width: node.__width,
        height: node.__height,
        title: node.__title,
      },
      node.__key
    );
  }

  constructor(payload, key) {
    super(key);
    this.__src = payload.src;
    this.__provider = payload.provider;
    this.__width = payload.width || 100;
    this.__height = payload.height || 150;
    this.__title = payload.title || "Uploaded Video";
  }

  static importJSON(serializedNode) {
    const { src, provider, width, height, title } = serializedNode;
    // TODO: verify $applyNodeReplacement(new VideoNode(payload)) or just newVideoNode
    return new VideoNode({ src, provider, width, height, title });
  }

  exportJSON() {
    return {
      type: "video",
      version: 1,
      src: this.__src,
      provider: this.__provider,
      width: this.__width,
      height: this.__height,
      title: this.__title,
    };
  }
  createDOM() {
    const div = document.createElement("div");
    // div.style.display = "inline-block";
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
                node: new VideoNode(
                  domNode.getAttribute("src"),
                  domNode.getAttribute("provider"),
                  domNode.getAttribute("width"),
                  domNode.getAttribute("height"),
                  domNode.getAttribute("title")
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
    const videoParentElement = document.createElement("div");
    videoParentElement.className = "inline-block text-center relative w-full";

    const videoElement = document.createElement("iframe");
    videoElement.setAttribute("src", getEmbedUrl(this.__src, this.__provider));
    if (this.__title) {
      videoElement.setAttribute("title", this.__title);
    }
    videoElement.style.width = this.__width + "%";
    videoElement.style.height = this.__height + "px";
    videoElement.className = "b-0 grow mx-auto pointer-events-auto";

    videoParentElement.appendChild(videoElement);
    // return should have "element" property
    return { element: videoParentElement };
  }

  // ? custom methods
  getSrc() {
    return this.__src;
  }

  getProvider() {
    return this.__provider;
  }

  getWidth() {
    return this.__width;
  }

  getHeight() {
    return this.__height;
  }

  getTitle() {
    return this.__title;
  }

  setWidthAndHeight(width, height) {
    this.getWritable().__width = width;
    this.getWritable().__height = height;
  }

  decorate() {
    console.log("returned object:", this.__src);
    return (
      <VideoComponent
        src={this.__src}
        provider={this.__provider}
        width={this.__width}
        height={this.__height}
        title={this.__title}
        nodeKey={this.getKey()}
      />
    );
  }

  isInline() {
    return false;
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
}

export function $createVideoNode(payload) {
  // return $applyNodeReplacement(new VideoNode(payload));
  return new VideoNode(payload);
}

export function $isVideoNode(node) {
  return node instanceof VideoNode;
}

const VideoComponent = ({ src, provider, width, height, title, nodeKey }) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const embedUrl = getEmbedUrl(src, provider);

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
      console.log(
        "Computed:",
        ref.offsetWidth,
        "/",
        editorWidth,
        "=",
        ref.offsetWidth / editorWidth
      );
      if (node) {
        node.setWidthAndHeight(
          (ref.offsetWidth / editorWidth) * 100.0,
          ref.offsetHeight
        );
      }
    });
  };

  return (
    <Resizable
      size={{ width: `${width}%`, height: `${height}px` }}
      onResizeStop={onResizeStop}
      minHeight={150}
      minWidth={200}
      maxWidth="100%"
      bounds="parent"
      className={`inline-block bg-slate-300 ${
        isSelected ? "ring-4 ring-blue-500" : ""
      }`}
    >
      <iframe
        src={embedUrl}
        className="b-0 grow mx-auto w-full h-full pointer-events-auto"
        title="Embedded Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        // onClick={onClick}
      ></iframe>
    </Resizable>
  );
};

// helper functions
const getEmbedUrl = (src, provider) => {
  if (provider === "youtube") {
    // Extract video ID from various YouTube URL formats
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = src.match(regex);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : src;
  } else if (provider === "vimeo") {
    // Extract video ID from Vimeo URL
    const regex = /(?:vimeo\.com\/)([0-9]+)/;
    const match = src.match(regex);
    return match ? `https://player.vimeo.com/video/${match[1]}` : src;
  } else {
    return src; // TODO: clarify if assume ID === embed link
  }
};
