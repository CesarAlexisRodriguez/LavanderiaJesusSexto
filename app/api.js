const BASE_URL = 'http://127.0.0.1:5000';

export async function loginRequest(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    return data; // { token, user }
  } catch (error) {
    console.error('Error en loginRequest:', error.message);
    throw error;
  }
}
