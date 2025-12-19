import React, { useState, useEffect } from "react";
import { Video, videoService } from "../services/videoService";
import VideoPlayer from "../components/VideoPlayer";
import VideoUpload from "../components/VideoUpload";
import { useAuth } from "../context/AuthContext";

const Videos: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "my">("all");

  useEffect(() => {
    fetchVideos();
  }, [viewMode]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response =
        viewMode === "all"
          ? await videoService.getVideos()
          : await videoService.getMyVideos();
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = async (video: Video) => {
    setSelectedVideo(video);

    if (video.status === "completed" && video.streamPath) {
      try {
        const response = await videoService.getStreamUrl(video._id);
        setStreamUrl(response.data.streamUrl);
      } catch (error) {
        console.error("Failed to get stream URL:", error);
      }
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchVideos();
  };

  const handleDelete = async (videoId: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await videoService.deleteVideo(videoId);
        setVideos(videos.filter((v) => v._id !== videoId));
        if (selectedVideo?._id === videoId) {
          setSelectedVideo(null);
        }
      } catch (error) {
        console.error("Failed to delete video:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      uploading: "bg-blue-100 text-blue-800",
      processing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {showUpload ? "Cancel" : "Upload Video"}
          </button>
        </div>

        {showUpload && (
          <div className="mb-6">
            <VideoUpload onUploadComplete={handleUploadComplete} />
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Videos
          </button>
          <button
            onClick={() => setViewMode("my")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "my"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            My Videos
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {selectedVideo ? (
                <VideoPlayer
                  video={selectedVideo}
                  streamUrl={streamUrl || undefined}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500">Select a video to watch</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Video List</h2>
              {videos.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No videos found</p>
                </div>
              ) : (
                videos.map((video) => (
                  <div
                    key={video._id}
                    className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition ${
                      selectedVideo?._id === video._id
                        ? "ring-2 ring-blue-600"
                        : ""
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">
                        {video.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${getStatusColor(
                          video.status
                        )}`}
                      >
                        {video.status}
                      </span>
                    </div>
                    {video.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      {viewMode === "my" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(video._id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
