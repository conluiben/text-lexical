"use client";
import { Resizable } from "re-resizable";
import { useEffect, useRef } from "react";

const page = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.style.height = "auto";
      iframe.offsetHeight;
      iframe.style.height = "100%";
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-16 items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-center">Embedded PDF</h1>
      <Resizable
        minHeight={300}
        minWidth={300}
        bounds="parent"
        className="flex bg-blue-100 h-full items-center justify-center"
      >
        <iframe
          ref={iframeRef}
          src="/data/test.pdf"
          className="b-0 grow mx-auto w-full h-full absolute top-0"
          title="PDF Viewer"
        ></iframe>
      </Resizable>
      <Resizable
        minHeight={300}
        minWidth={300}
        bounds="parent"
        className="flex bg-blue-100 h-full items-center justify-center"
      >
        <iframe
          ref={iframeRef}
          src="https://www.youtube.com/embed/KdSjj0c0xfs?si=8oQnYHfURLUba_Pw"
          className="b-0 grow mx-auto w-full h-full absolute top-0"
          title="Test Video"
        ></iframe>
      </Resizable>
    </div>
  );
};

export default page;
