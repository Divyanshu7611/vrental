export type VideoPlatform = "youtube" | "instagram";

export type ParsedVideoLink = {
  platform: VideoPlatform;
  url: string;
  thumbnailUrl: string;
  label: string;
};

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
];

const INSTAGRAM_PATTERNS = [
  /instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/,
];

export function extractYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

export function isValidInstagramUrl(url: string): boolean {
  const trimmed = url.trim();
  return INSTAGRAM_PATTERNS.some((p) => p.test(trimmed));
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function normalizeYouTubeUrl(url: string): string {
  const id = extractYouTubeVideoId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url.trim();
}

export function normalizeInstagramUrl(url: string): string {
  return url.trim();
}

export function parseApartmentVideoLinks(
  instagramVideoLink?: string | null,
  youtubeVideoLink?: string | null
): ParsedVideoLink[] {
  const links: ParsedVideoLink[] = [];

  if (youtubeVideoLink?.trim()) {
    const videoId = extractYouTubeVideoId(youtubeVideoLink);
    if (videoId) {
      links.push({
        platform: "youtube",
        url: normalizeYouTubeUrl(youtubeVideoLink),
        thumbnailUrl: getYouTubeThumbnail(videoId),
        label: "YouTube Video",
      });
    }
  }

  if (instagramVideoLink?.trim() && isValidInstagramUrl(instagramVideoLink)) {
    links.push({
      platform: "instagram",
      url: normalizeInstagramUrl(instagramVideoLink),
      thumbnailUrl: "/images/instagram-video-placeholder.svg",
      label: "Instagram Reel/Post",
    });
  }

  return links;
}
