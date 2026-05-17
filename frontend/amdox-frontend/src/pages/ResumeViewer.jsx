export default function ResumeViewer({ url }) {
  return (
    <iframe
      src={url}
      className="w-full h-[600px]"
      title="Resume"
    />
  );
}