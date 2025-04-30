export function operationLocalStorage({ name = "", secrectKey }) {
  const { username, password } = handleLocalStorage();
  if (name.trim() !== username) return "UserName InCorrect";
  if (secrectKey !== password) return "PassWord InCorrect";
  return name.trim() === username && secrectKey === password;
}

export function handleLocalStorage() {
  const username = localStorage.getItem("username") || null;
  const password = localStorage.getItem("password") || null;
  return { username, password };
}

export function handleCreatinal(inputs) {
  const { username, password } = inputs.current;
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
}

export function handleLogout() {
  localStorage.clear();
}
