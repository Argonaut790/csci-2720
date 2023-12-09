import dynamic from "next/dynamic";

const DynamicMapContent = dynamic(
  () => import("@components/MapContent"),
  { ssr: false } // This will load the component only on client side
);

const DynamicContent = () => {
  return <DynamicMapContent />;
};

export default DynamicContent;
