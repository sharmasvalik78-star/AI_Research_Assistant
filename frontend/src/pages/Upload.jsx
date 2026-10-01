import UploadBox from "../components/layout/upload/UploadBox";

export default function Upload() {
    return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Document Upload
          </h1>

          <p className="mt-2 text-slate-500">
            Upload research documents to analyze and organize them with your AI research assistant.
          </p>
        </div>

        <UploadBox />
      </div>
    </div>
  );
}