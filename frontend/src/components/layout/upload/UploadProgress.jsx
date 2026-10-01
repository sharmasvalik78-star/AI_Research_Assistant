export default function UploadProgress({
  uploading,
  progress,
}) {
  if (!uploading) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Upload progress"
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {progress}% Uploaded
      </p>
    </div>
  );
}