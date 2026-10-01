import { useState } from "react";
import toast from "react-hot-toast";

import {
  createResearchReportShare,
  updateResearchReportPublicStatus,
  updateResearchReportDownloadPermission,
  revokeResearchReportShare,
} from "../../services/researchReportService";

export default function ProjectReportsWorkspace({ projectId }) {
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingDownload, setUpdatingDownload] = useState(false);
  const [revokingShare, setRevokingShare] = useState(false);

  const [shareUrl, setShareUrl] = useState("");
  const [shareToken, setShareToken] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [allowDownload, setAllowDownload] = useState(true);
  const [expiration, setExpiration] = useState("never");

    const handleCreateShare = async () => {
    try {
      setLoading(true);

      let expiresAt = null;

      if (expiration !== "never") {
        const now = new Date();

        if (expiration === "1h") {
          now.setHours(now.getHours() + 1);
        }

        if (expiration === "24h") {
          now.setHours(now.getHours() + 24);
        }

        if (expiration === "7d") {
          now.setDate(now.getDate() + 7);
        }

        if (expiration === "30d") {
          now.setDate(now.getDate() + 30);
        }

        expiresAt = now.toISOString();
      }

      const data = await createResearchReportShare(projectId, {
        isPublic,
        allowDownload,
        expiresAt,
      });

      const url = `${window.location.origin}/public/research-reports/${data.share_token}`;

      setShareUrl(url);
      setShareToken(data.share_token);
      setIsPublic(data.is_public);
      setAllowDownload(data.allow_download);

      toast.success("Share link created successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create share link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied.");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleRevokeShare = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently revoke this share link?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRevokingShare(true);

      await revokeResearchReportShare(shareToken);

      setShareUrl("");
      setShareToken("");
      setIsPublic(false);
      setAllowDownload(false);

      toast.success("Share link revoked successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to revoke share link.");
    } finally {
      setRevokingShare(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
            📊
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Research Reports
            </h2>

            <p className="mt-2 max-w-2xl text-slate-500">
              Generate a secure public link to share this project's
              research report with anyone.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Project Report
        </div>
      </div>

      {/* Generate Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 via-white to-blue-50 px-7 py-8">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              Share Your Research
            </h3>

            <p className="mt-2 leading-7 text-slate-500">
              Create a public shareable link for this project's research
              report. You can copy the link or open the report in a new tab.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-semibold text-slate-800">
                Generate a public report link
              </p>

              <p className="mt-1 text-sm text-slate-500">
                The generated link can be shared with others.
              </p>
            </div>

            <div className="w-full lg:w-72">
              <label
                htmlFor="share-expiration"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Link Expiration
              </label>

              <select
                id="share-expiration"
                value={expiration}
                onChange={(event) => setExpiration(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="never">Never expires</option>
                <option value="1h">1 hour</option>
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreateShare}
              disabled={loading}
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </span>
              ) : (
                "Generate Share Link"
              )}
            </button>
          </div>
        </div>
        </div>

      {/* Generated Share Link */}
      {shareUrl && (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-7 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                ✓
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Share Link Ready
                </h3>

                <p className="mt-1 text-slate-600">
                  Your public research report link has been generated
                  successfully.
                </p>
              </div>
            </div>

            {/* Public Access */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  Public Access
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {isPublic
                    ? "Anyone with the link can view this research report."
                    : "This research report is currently private."}
                </p>
              </div>

              <button
                type="button"
                disabled={updatingStatus}
                onClick={async () => {
                  try {
                    setUpdatingStatus(true);

                    const newStatus = !isPublic;

                    const data =
                      await updateResearchReportPublicStatus(
                        shareToken,
                        newStatus
                      );

                    setIsPublic(data.is_public);

                    toast.success(
                      data.is_public
                        ? "Public access enabled."
                        : "Public access disabled."
                    );
                  } catch (error) {
                    console.error(error);
                    toast.error("Failed to update public access.");
                  } finally {
                    setUpdatingStatus(false);
                  }
                }}
                className={`relative inline-flex h-8 w-16 shrink-0 items-center rounded-full transition ${
                  isPublic ? "bg-emerald-500" : "bg-slate-300"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                    isPublic ? "translate-x-9" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Allow Download */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-800">
                  Allow Download
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {allowDownload
                    ? "Anyone with the link can download this research report."
                    : "Downloading this research report is currently disabled."}
                </p>
              </div>

              <button
                type="button"
                disabled={updatingDownload}
                onClick={async () => {
                  try {
                    setUpdatingDownload(true);

                    const newDownloadStatus = !allowDownload;

                    const data =
                      await updateResearchReportDownloadPermission(
                        shareToken,
                        newDownloadStatus
                      );

                    setAllowDownload(data.allow_download);

                    toast.success(
                      data.allow_download
                        ? "Download permission enabled."
                        : "Download permission disabled."
                    );
                  } catch (error) {
                    console.error(error);
                    toast.error(
                      "Failed to update download permission."
                    );
                  } finally {
                    setUpdatingDownload(false);
                  }
                }}
                className={`relative inline-flex h-8 w-16 shrink-0 items-center rounded-full transition ${
                  allowDownload ? "bg-emerald-500" : "bg-slate-300"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                    allowDownload
                      ? "translate-x-9"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-2">
              <input
                readOnly
                value={shareUrl}
                className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
              />
            </div>

           <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCopy}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
              >
                Copy Link
              </button>

              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50"
              >
                Open Report ↗
              </a>

              <button
                type="button"
                onClick={handleRevokeShare}
                disabled={revokingShare}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {revokingShare ? "Revoking..." : "Revoke Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}