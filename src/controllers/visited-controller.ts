import Visited from "../models/visited-model";

//@ts-ignore
export async function isVisited(req, res) {
    const { id } = req.params;
    const { category, quesId } = req.query;

    try {
        const foundVisited = await Visited.findOne({ userId: id, category, quesId, isVisited: true });

        if (foundVisited) {
            const alreadyVisited = await Visited.find({ userId: id, isVisited: true });
            return res.status(200).json(alreadyVisited);
        }
        
        await Visited.create({ userId: id, category, quesId});
        const updatedVisited = await Visited.find({ userId: id });

        return res.status(200).json(updatedVisited);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}