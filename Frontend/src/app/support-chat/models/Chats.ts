
export interface ChatData {
    Chats: Chats;
}

export interface Chats {
    mensaje: string;
    hour:    string;
    chat:    Chat;
}

export interface Chat {
    id_chat:     number;
    nombre_sala: string;
    estado:      string;
}

export class ChatxMens {
    static chatxMens(obj: Chats) {
        return new ChatxMens(
            obj['mensaje'],
            obj['hour'],
            obj['chat']['id_chat'],
            obj['chat']['nombre_sala'],
            obj['chat']['estado']
        );
    }

    constructor(
        public mensaje: string,
        public hour: string,
        public id_chat: number,
        public nombre_sala: string,
        public estado: string
    ) { }
}