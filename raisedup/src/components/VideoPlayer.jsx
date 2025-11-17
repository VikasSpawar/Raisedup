import React from 'react';

const VideoPlayer = ({ videoUrl, title }) => {
  // Extract video ID from URL
  const getVideoEmbed = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]
        : url.split('v=')[1]?.split('&')[0];
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
      };
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1];
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`
      };
    }

    // Direct video file
    return {
      type: 'direct',
      embedUrl: url
    };
  };

  const videoEmbed = getVideoEmbed(videoUrl);

  if (!videoEmbed) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white">
        <p>No video available</p>
      </div>
    );
  }

  if (videoEmbed.type === 'direct') {
    return (
      <video
        className="w-full aspect-video rounded-xl"
        controls
        src={videoEmbed.embedUrl}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        src={videoEmbed.embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;
