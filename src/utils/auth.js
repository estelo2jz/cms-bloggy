const AUTH_KEY = 'cms-auth';
const ROLE_KEY = 'cms-role';
const AUTHOR_KEY = 'cms-author';
const EXPIRE_KEY = 'cms-expire';

export function login(role = 'admin', durationMinutes = 30, authorName = 'Admin') {
  const expiresAt = Date.now() + durationMinutes * 60 * 1000;
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(AUTHOR_KEY, authorName);
  localStorage.setItem(EXPIRE_KEY, expiresAt.toString());
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(AUTHOR_KEY);
  localStorage.removeItem(EXPIRE_KEY);
}

export function isAuthenticated() {
  const expires = parseInt(localStorage.getItem(EXPIRE_KEY), 10);
  if (!expires || Date.now() > expires) {
    logout();
    return false;
  }
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getUserRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getAuthorName() {
  return localStorage.getItem(AUTHOR_KEY);
}
