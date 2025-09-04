import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ExportButton = ({ updateHtml }) => {
  const [editor] = useLexicalComposerContext();
  const handleClickExport = () => {
    // to be used inside LexicalComposer context
    const editorState = editor.getEditorState();

    const fetchedHtmlString = editorState.read(() => {
      return $generateHtmlFromNodes(editor);
    });
    console.log("Exported HTML:");
    console.log({ __html: fetchedHtmlString });
    updateHtml({ __html: fetchedHtmlString });
  };

  return (
    <button
      onClick={handleClickExport}
      className="bg-red-200 hover:bg-red-300 p-2"
    >
      Export Content
    </button>
  );
};

export default ExportButton;
