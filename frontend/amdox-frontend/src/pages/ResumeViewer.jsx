export default function ResumeViewer({ url }) {
  return (
    <iframe
      src={url}
      width="100%"
      height="600px"
      title="Resume"
    />
  );
}