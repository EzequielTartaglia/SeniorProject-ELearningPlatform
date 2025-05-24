'use client'
import { useEffect, useState } from 'react';

export default function YouTubePreview({ videoId }) {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            setPlayer(new window.YT.Player(`youtube-player-${videoId}`, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    modestbranding: 1, // hide YouTube logo
                    rel: 0,
                    showinfo: 0,
                },
                events: {
                    onStateChange: (event) => {
                        setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                    }
                },
            }));
        };

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [player, videoId]);

    const handleMouseEnter = () => {
        setShowControls(true);
    };

    const handleMouseLeave = () => {
        if (!isPlaying) {
            setShowControls(false);
        }
    };

    return (
        <>
            {videoId && (
                <div
                    className="relative border-secondary border-2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}
                >
                    <iframe
                        id={`youtube-player-${videoId}`}
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                        title="YouTube Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: 0 }}
                    ></iframe>
                </div>
            )}
        </>
    );
}
