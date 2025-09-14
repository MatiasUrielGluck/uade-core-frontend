import api from './api';
import type { SubscriptionRow } from '../components/MySubscriptions/MySubscriptionsRow';

export interface SubscriptionResponse {
  subscriptionId: string;
  webhookUrl: string;
  squadName: string;
  topic: string;
  eventName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  message: string;
}

export interface CreateSubscriptionRequest {
  webhookUrl: string;
  squadName: string;
  topic: string;
  eventName: string;
}

export interface UpdateSubscriptionRequest {
  webhookUrl?: string;
  squadName?: string;
  topic?: string;
  eventName?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

// Convertir respuesta de la API al formato interno
const mapSubscriptionResponse = (response: SubscriptionResponse): SubscriptionRow => ({
  subscriptionId: response.subscriptionId,
  webhookUrl: response.webhookUrl,
  squadName: response.squadName,
  topic: response.topic,
  eventName: response.eventName,
  status: response.status,
  createdAt: response.createdAt,
  message: response.message,
});

export const subscriptionsService = {
  // Obtener todas las suscripciones
  async getAllSubscriptions(): Promise<SubscriptionRow[]> {
    try {
      const response = await api.get<SubscriptionResponse[]>('/subscribe');
      return response.data.map(mapSubscriptionResponse);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw new Error('Error al obtener las suscripciones');
    }
  },

  // Obtener suscripción por ID
  async getSubscriptionById(subscriptionId: string): Promise<SubscriptionRow> {
    try {
      const response = await api.get<SubscriptionResponse>(`/subscribe/${subscriptionId}`);
      return mapSubscriptionResponse(response.data);
    } catch (error) {
      console.error('Error fetching subscription by ID:', error);
      throw new Error('Error al obtener la suscripción');
    }
  },

  // Crear nueva suscripción
  async createSubscription(data: CreateSubscriptionRequest): Promise<SubscriptionRow> {
    try {
      const response = await api.post<SubscriptionResponse>('/subscribe', data);
      return mapSubscriptionResponse(response.data);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Error al crear la suscripción');
    }
  },

  // Actualizar suscripción
  async updateSubscription(subscriptionId: string, data: UpdateSubscriptionRequest): Promise<SubscriptionRow> {
    try {
      const response = await api.put<SubscriptionResponse>(`/subscribe/${subscriptionId}`, data);
      return mapSubscriptionResponse(response.data);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Error al actualizar la suscripción');
    }
  },

  // Eliminar suscripción
  async deleteSubscription(subscriptionId: string): Promise<void> {
    try {
      await api.delete(`/subscribe/${subscriptionId}`);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw new Error('Error al eliminar la suscripción');
    }
  },

  // Buscar suscripciones por término
  async searchSubscriptions(query: string): Promise<SubscriptionRow[]> {
    try {
      const response = await api.get<SubscriptionResponse[]>(`/subscribe/search?q=${encodeURIComponent(query)}`);
      return response.data.map(mapSubscriptionResponse);
    } catch (error) {
      console.error('Error searching subscriptions:', error);
      throw new Error('Error al buscar suscripciones');
    }
  },
};
