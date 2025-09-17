import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection } from "lexical";

export const formatParagraph = (editor) => {
  editor.update(() => {
    const selection = $getSelection();
    $setBlocksType(selection, () => $createParagraphNode());
  });
};

export const formatHeading = (editor, blockTag, headingSize) => {
  if (blockTag !== headingSize) {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode(headingSize));
    });
  }
};

export const formatBulletList = (editor, blockType) => {
  if (blockType !== "bullet") {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

// export const formatCheckList = (editor, blockType) => {
//   if (blockType !== 'check') {
//     editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
//   } else {
//     formatParagraph(editor);
//   }
// };

export const formatNumberedList = (editor, blockType, blockTag) => {
  // listType === "number"
  if (blockType !== "list" && blockTag !== "ol") {
    console.log("run");
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatQuote = (editor, blockType, blockTag) => {
  if (blockType !== "list" && blockTag !== "ul") {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createQuoteNode());
    });
  }
};

// export const formatCode = (editor: LexicalEditor, blockType: string) => {
//   if (blockType !== 'code') {
//     editor.update(() => {
//       let selection = $getSelection();
//       if (!selection) {
//         return;
//       }
//       if (!$isRangeSelection(selection) || selection.isCollapsed()) {
//         $setBlocksType(selection, () => $createCodeNode());
//       } else {
//         const textContent = selection.getTextContent();
//         const codeNode = $createCodeNode();
//         selection.insertNodes([codeNode]);
//         selection = $getSelection();
//         if ($isRangeSelection(selection)) {
//           selection.insertRawText(textContent);
//         }
//       }
//     });
//   }
// };
