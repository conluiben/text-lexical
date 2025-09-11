"use client";
import { Resizable } from "re-resizable";

const page = () => {
  return (
    <div className="p-8 bg-orange-100 relative top-0 overflow-hidden">
      <p>
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
        ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
        tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
        Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
        massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper
        vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
        inceptos himenaeos.
      </p>
      <Resizable
        defaultSize={{ height: "auto" }}
        bounds="parent"
        className="border inline-block"
        minWidth={100}
        maxWidth="100%"
        minHeight={100}
        maxHeight="100%"
        lockAspectRatio
      >
        <img
          className="w-full h-full object-cover"
          src="https://placehold.co/600x100/png?text=My+New+Post"
          draggable="false"
        />
      </Resizable>
      <p>
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
        ex sapien vitae pellentesque sem placerat. In id cursus mi pretium
        tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
        Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis
        massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper
        vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra
        inceptos himenaeos.
      </p>
    </div>
  );
};

export default page;
