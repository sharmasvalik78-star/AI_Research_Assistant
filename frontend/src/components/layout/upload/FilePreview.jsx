export default function FilePreview({
  file,
}) {
  if (!file) {
    return null;
  }

  return (
    <div className="mt-6 bg-gray-100 rounded-lg p-4">
      <p className="font-semibold">
        Selected File
      </p>

      <p className="text-blue-600 break-all">
        {file.name}
      </p>

      <p className="text-sm text-gray-500">
        {(file.size / 1024).toFixed(2)} KB
      </p>
    </div>
  );
}