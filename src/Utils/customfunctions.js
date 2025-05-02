export function handleLocalStorage() {
  const isHere = JSON.parse(localStorage.getItem("currentUser")) || null;
  if (isHere) return true;
}

export function handleLogout(navigate) {
  localStorage.removeItem("currentUser");
  navigate("/");
}
