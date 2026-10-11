import { BASE_WS_URL } from '../../config/envs';
import { authStorage } from '../../hooks/auth-storage';

// Sent by the backend when the access token used in the handshake expires.
const TOKEN_EXPIRED_CLOSE_CODE = 4401;

type QueueSocketSubscriber = (payload: Record<string, unknown>) => void;

export class QueueSocketService {
  private static socket: WebSocket | null = null;
  private static reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private static shouldReconnect = false;
  private static subscribers = new Set<QueueSocketSubscriber>();

  static subscribeToSocket(callback: QueueSocketSubscriber) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  static startSocket() {
    this.shouldReconnect = true;
    this.connect();
    return () => this.stopSocket();
  }

  static stopSocket() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    this.socket = null;
  }

  private static connect() {
    if (!this.shouldReconnect || this.socket) return;
    if (!BASE_WS_URL) {
      console.error('[socket] missing VITE_WS_URL');
      return;
    }

    const token = authStorage.getAccessToken();
    if (!token) {
      console.warn('[socket] skipped: no access token');
      return;
    }

    const separator = BASE_WS_URL.includes('?') ? '&' : '?';
    const socket = new WebSocket(
      `${BASE_WS_URL}${separator}token=${encodeURIComponent(token)}`
    );
    this.socket = socket;

    socket.addEventListener('open', () =>
      console.log('[socket] connected', { url: BASE_WS_URL })
    );
    socket.addEventListener('error', (error) =>
      console.error('[socket] error', { error, url: BASE_WS_URL })
    );
    socket.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data) as Record<string, unknown>;
        this.subscribers.forEach((subscriber) => subscriber(payload));
      } catch (error) {
        console.error('[socket] invalid message', { error, raw: event.data });
      }
    });
    socket.addEventListener('close', (event) => {
      if (this.socket === socket) {
        this.socket = null;
      }

      if (!this.shouldReconnect) return;
      if (event.code === TOKEN_EXPIRED_CLOSE_CODE) {
        console.warn('[socket] session expired, not reconnecting');
        return;
      }

      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, 1000);
    });
  }
}
