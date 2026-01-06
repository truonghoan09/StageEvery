// utils/validateSocialLink.js

function validateAndNormalizeSocialLink(rawUrl, allowedDomains) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error('INVALID_URL');
  }

  // 1. Chỉ cho phép https
  if (url.protocol !== 'https:') {
    throw new Error('INVALID_PROTOCOL');
  }

  // 2. Kiểm tra domain
  const hostname = url.hostname.toLowerCase();

  const isAllowed = allowedDomains.some(domain => {
    const d = domain.toLowerCase();
    return hostname === d || hostname.endsWith(`.${d}`);
  });

  if (!isAllowed) {
    throw new Error('INVALID_DOMAIN');
  }

  // 3. Chuẩn hoá URL (không query, không hash)
  url.search = '';
  url.hash = '';

  return url.toString();
}

module.exports = {
  validateAndNormalizeSocialLink,
};
