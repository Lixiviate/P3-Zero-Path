// use this to decode a token and get the user's information out of it
import decode from "jwt-decode";

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  login(idToken, redirect = true) {
    localStorage.setItem("id_token", idToken);

    const loginEvent = new CustomEvent("userLoggedIn");
    window.dispatchEvent(loginEvent);

    if (redirect) {
      window.location.assign("/dashboard");
    }
  }

  logout() {
    localStorage.removeItem("id_token");
    const logoutEvent = new CustomEvent("userLoggedOut");
    window.dispatchEvent(logoutEvent);

    window.location.assign("/");
  }
}

export default new AuthService();