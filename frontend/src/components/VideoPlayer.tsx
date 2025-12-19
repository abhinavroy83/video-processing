import React, { useEffect, useRef, useState } from "react";
import { Video } from "../services/videoService";

interface VideoPlayerProps {
  video: Video;
  streamUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getSensitivityBadge = () => {
    const score = video.sensitivityAnalysis?.score || 0;

    if (score < 30) {
      return (
        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
          Safe
        </span>
      );
    } else if (score < 70) {
      return (
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
          Flagged
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
          High Sensitivity
        </span>
      );
    }
  };

  const getModerationBadge = () => {
    const status = video.moderationStatus;
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      flagged: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative bg-black aspect-video">
        {video.status === "completed" && streamUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            poster={video.thumbnailPath}
          >
            <source src={`/api${streamUrl}`} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              {video.status === "processing" && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Processing video...</p>
                </>
              )}
              {video.status === "uploading" && <p>Uploading...</p>}
              {video.status === "failed" && (
                <p className="text-red-500">Processing failed</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{video.title}</h3>
          <div className="flex gap-2">
            {getSensitivityBadge()}
            {getModerationBadge()}
          </div>
        </div>

        {video.description && (
          <p className="text-gray-600 mb-3">{video.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <p>
              <strong>Duration:</strong>{" "}
              {video.duration
                ? `${Math.floor(video.duration / 60)}:${(video.duration % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "N/A"}
            </p>
            <p>
              <strong>Format:</strong> {video.metadata?.format || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Resolution:</strong> {video.metadata?.resolution || "N/A"}
            </p>
            <p>
              <strong>Size:</strong>{" "}
              {(video.fileSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>

        {video.sensitivityAnalysis &&
          video.sensitivityAnalysis.flags.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Content Flags:
              </p>
              <div className="flex flex-wrap gap-2">
                {video.sensitivityAnalysis.flags.map((flag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          )}

        {video.tags && video.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
