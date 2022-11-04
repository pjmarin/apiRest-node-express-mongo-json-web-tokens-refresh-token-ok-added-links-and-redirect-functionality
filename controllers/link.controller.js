import { nanoid } from 'nanoid';
import { Link } from "../models/Link.js";

export const createLink = async (req, res) => {
    try {
        let { longLink } = req.body;
        if (!longLink.startsWith("http")) {
            longLink = "https://" + longLink;
        }
        const link = new Link({ longLink, nanoLink: nanoid(6), uid: req.uid });
        const newLink = await link.save();
        return res.status(201).json({ newLink });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error de servidor" });
    }
};

// Opcion v1 para un CRUD tradicional
// export const getLinksCRUD = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const links = await Link.findById(id);
//         // const links = await Link.find({ uid: req.uid }).lean(); // working

//         if(!links) {
//             return res.status(404).json({ error: "Links not found" });
//         }

//         if(!links.uid.equals(req.uid)) {
//             return res.status(404).json({ error: "User not allowed to see links" });
//         }

//         return res.json({ links });
//     } catch (error) {
//         console.log("Error: ", error);
//         if(error.kind === "ObjectId") {
//             return res.status(400).json({ error: "Formato de id incorrecto" });
//         }
//         return res.status(500).json({ error: "Ha habido algun error al intentar traer el listado de enlaces: " + error });
//     }
// };

// Opcion 2
export const getLinks = async (req, res) => {
    try {
        const { nanoLink } = req.params;
        const links = await Link.findOne({nanoLink});
        // const links = await Link.find({ uid: req.uid }).lean(); // working

        if(!links) {
            return res.status(404).json({ error: "Links not found" });
        }

        return res.json({ longLink: links.longLink });
    } catch (error) {
        console.log("Error: ", error);
        if(error.kind === "ObjectId") {
            return res.status(400).json({ error: "Formato de id incorrecto" });
        }
        return res.status(500).json({ error: "Ha habido algun error al intentar traer el listado de enlaces: " + error });
    }
};

export const removeLink = async (req, res) => {
    try {
        const { id } = req.params;
        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: "no existe link" });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: "Este enlace pertenece a otro usuario" });

        await link.remove();
        return res.json({ link });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId")
            return res.status(403).json({ error: "Formato id incorrecto" });
        return res.status(500).json({ error: "Error de servidor: " + error });
    }
};

export const updateLink = async (req, res) => {
    try {
        const { id } = req.params;
        let { longLink } = req.body;
        if (!longLink.startsWith("https://")) {
            longLink = "https://" + longLink;
        }

        const link = await Link.findById(id);

        if (!link) return res.status(404).json({ error: "No existe el link" });

        if (!link.uid.equals(req.uid))
            return res.status(401).json({ error: "Este enlace pertenece a otro usuario" });

        link.longLink = longLink;

        await link.save();

        return res.json({ link });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};

// busqueda por nanoLink
export const getNanoLink = async (req, res) => {
    try {
        const { nanoLink } = req.params;
        const link = await Link.findOne({ nanoLink });

        if (!link) return res.status(404).json({ error: "No existe el link" });

        return res.json({ longLink: link.longLink });
    } catch (error) {
        console.log(error);
        if (error.kind === "ObjectId") {
            return res.status(403).json({ error: "Formato id incorrecto" });
        }
        return res.status(500).json({ error: "error de servidor" });
    }
};