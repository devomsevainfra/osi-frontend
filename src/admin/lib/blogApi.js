/**
 * Blog API functions — admin (credentialed) operations.
 * Uses the shared fetch wrapper from ./api.js.
 */
import { api } from './api';

/**
 * List blogs (drafts + published for admins).
 * @param {number} page
 * @param {number} limit
 */
export function getBlogs(page = 1, limit = 15) {
  const params = new URLSearchParams({ page, limit });
  return api.get(`/blog?${params}`);
}

/**
 * Get a single blog by slug.
 * @param {string} slug
 */
export function getBlogBySlug(slug) {
  return api.get(`/blog/${slug}`);
}

/**
 * Create a new blog (always draft).
 * @param {FormData} formData - title, content, image (optional)
 */
export function createBlog(formData) {
  return api.post('/blog', formData);
}

/**
 * Update a blog.
 * @param {string} id - blog _id
 * @param {FormData} formData - only changed fields
 */
export function updateBlog(id, formData) {
  return api.put(`/blog/${id}`, formData);
}

/**
 * Delete a blog by id.
 * @param {string} id - blog _id
 */
export function deleteBlog(id) {
  return api.delete(`/blog/${id}`);
}
