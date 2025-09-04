import { DecoratorNode } from "lexical";
import Image from "next/image";

const ImageComponent = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={600}
    height={400}
    className="w-full my-4 object-cover"
  />
);

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }
  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }
  static importJSON(serializedNode) {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }
  constructor(src, alt, key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }
  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
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
                  domNode.getAttribute("alt")
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
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", this.__src);
    if (this.__alt) {
      imgElement.setAttribute("alt", this.__alt);
    }
    imgElement.className = "w-full my-4";
    // return should have "element" property
    return { element: imgElement };
  }
  decorate() {
    return <ImageComponent src={this.__src} alt={this.__alt} />;
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
}

export function $createImageNode({ src, alt }) {
  return new ImageNode(src, alt);
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
