"use client";
import Editor from "@/components/Editor";

const page = () => {
  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl">Lexical Text Editor</h1>
      <p className="italic mb-4">Test: formatting text below</p>
      <Editor />
    </div>
  );
};

export default page;
