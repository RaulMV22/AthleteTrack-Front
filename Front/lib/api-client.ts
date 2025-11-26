// API client for communicating with the backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    // Usamos siempre un objeto Headers real
    const headers = new Headers(options.headers || {});

    // Aseguramos Content-Type por defecto (salvo que ya venga uno puesto)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Añadimos Authorization si hay token
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Error en la petición' }));
      throw new Error(error.error || 'Error en la petición');
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(
    email: string,
    password: string,
    name: string,
    username: string
  ) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, username }),
    });
    this.setToken(data.token);
    return data;
  }

  async googleLogin(idToken: string) {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: idToken }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    return this.request(`/auth/check-username?username=${encodeURIComponent(username)}`);
  }

  // Events endpoints
  async getEvents() {
    return this.request('/events');
  }

  async getEvent(id: number) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: number, eventData: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserEventRegistrations(userId: number) {
    return this.request(`/events/registrations/${userId}`);
  }

  async registerForEvent(eventId: number) {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST',
    });
  }

  async unregisterFromEvent(eventId: number) {
    return this.request(`/events/${eventId}/register`, {
      method: 'DELETE',
    });
  }

  // Workouts endpoints
  async getWorkouts(userId: number) {
    return this.request(`/workouts/${userId}`);
  }

  async createWorkout(workoutData: any) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  async deleteWorkout(id: number) {
    return this.request(`/workouts/${id}`, {
      method: 'DELETE',
    });
  }

  // User profile endpoints
  async updateProfile(data: { name?: string; email?: string; avatar?: string }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
