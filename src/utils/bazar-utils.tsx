import { clearIdentity } from "./identity-storage";

export function handleLogout() {
    clearIdentity();
    window.location.reload();
}
