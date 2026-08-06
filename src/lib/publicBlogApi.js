/**
 * Public (no-credential) blog API functions.
 * Uses the shared axios instance from ./publicApi.js.
 */
import { publicApi } from './publicApi';

/**
 * List published blogs (public, no auth).
 * @param {number} page
 * @param {number} limit
 */
export function getPublicBlogs(page = 1, limit = 9) {
  return publicApi.get('/blog', { params: { page, limit } });
}

/**
 * Get a single published blog by slug (public, no auth).
 * @param {string} slug
 */
export function getPublicBlogBySlug(slug) {
  return publicApi.get(`/blog/${slug}`);
}
