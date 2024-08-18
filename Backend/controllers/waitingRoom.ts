import { Request , Response } from "express";
import ChatRooms from "../models/chatRooms";

export const waitingRoom = async (req: Request,res: Response) => {
    // Recuperar todos los chats de cada usuario
    try {
        const chatUsers = await ChatRooms.findAll();
        //console.log(chatUsers);
        return res.status(200).json({Chats:chatUsers});
    } catch (error) {
        console.log(error);
        
    }
    
};

//Asesor ingresa a un chat por medio del roomID
export const enterChat = async (req: Request, res: Response) => {
    const { roomID, id_asesor } = req.body;

    res.json({msg: "Ingresando al chat"});
};