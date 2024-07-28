import { Request, Response } from 'express';




export const getMessages = async (req: Request, res: Response) => {
    res.status(200).json({
        ok: true,
        msg: 'getMessages'
    });

    /* const { from } = req.params;
    const myId = req.uid;

    const last30 = await Message.find({
        $or: [{ from: myId, to: from }, { from: from, to: myId }]
    })
        .sort({ createdAt: 'desc' })
        .limit(30);

    res.json({
        ok: true,
        messages: last30
    }); */
};

