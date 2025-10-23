
const BASE_URL = process.env.REACT_APP_API_URL;

export const signupUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const loginWithGoogle = () => {

  window.location.href = `${BASE_URL}/api/auth/google`;
};
