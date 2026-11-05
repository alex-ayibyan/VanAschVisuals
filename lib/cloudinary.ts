// Cloudinary delivers the original upload by default (often 5–15 MB straight
// from the camera). Inserting a transformation into the delivery URL makes
// Cloudinary serve a resized, auto-compressed, auto-format (WebP/AVIF) copy,
// while the original stays stored untouched.

const PRESETS = {
  /** Admin thumbnails */
  thumb: 'f_auto,q_auto,c_fill,w_320,h_320',
  /** Project cover cards on the homepage */
  card: 'f_auto,q_auto,c_limit,w_1000',
  /** Images in the horizontal project gallery */
  gallery: 'f_auto,q_auto,c_limit,w_1200,h_1200',
  /** Full-screen lightbox */
  full: 'f_auto,q_auto,c_limit,w_2400,h_2400',
} as const;

export type CloudinaryPreset = keyof typeof PRESETS;

const UPLOAD_SEGMENT = '/image/upload/';

/**
 * Returns a resized Cloudinary URL for the given preset.
 * Non-Cloudinary URLs (e.g. local /images/... fallbacks) are returned unchanged.
 */
export function cldUrl(url: string | undefined, preset: CloudinaryPreset): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes(UPLOAD_SEGMENT)) return url;

  const [base, rest] = url.split(UPLOAD_SEGMENT, 2);
  // Skip if the URL already carries a transformation such as "w_800,q_auto"
  const firstSegment = rest.split('/')[0];
  if (/^[a-z]{1,3}_[^,/]+(,[a-z]{1,3}_[^,/]+)*$/.test(firstSegment)) return url;

  return `${base}${UPLOAD_SEGMENT}${PRESETS[preset]}/${rest}`;
}
