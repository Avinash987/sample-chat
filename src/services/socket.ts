import { connect } from 'socket.io-client';

class SocketService {
    private socket: any = null;
    private static instance: SocketService;

    private constructor() {}

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    connect(token: string): void {
        this.socket = connect('http://localhost:3001', {
            auth: { token }
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data: any = {}): void {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event: string): void {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export default SocketService.getInstance();
