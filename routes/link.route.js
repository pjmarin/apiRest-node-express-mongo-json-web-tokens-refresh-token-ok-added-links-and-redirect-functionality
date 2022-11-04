import { Router } from "express";
import { createLink, getLinks, removeLink, updateLink } from "../controllers/link.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyLinkValidator, tokenHeaderValidator, paramsLinkValidator } from "../middlewares/validatorManager.js";

const router = Router();

// GET      api/v1/links                all links
// GET      api/v1/links/:nanoLink      search link
// POST     api/v1/links                create link
// PATCH    api/v1/links                update link
// DELETE   api/v1/links/:nanoLink      remove link

// router.get("/", tokenHeaderValidator, requireToken, getLinks);
router.get("/", requireToken, getLinks);
// router.get("/:id", requireToken, getLinks);
// router.get("/idLink/:id", requireToken, getLinks);
// router.get("/idUser/:id", requireToken, getLinks);
router.post("/", requireToken, bodyLinkValidator, createLink);
router.delete(
    "/:id",
    tokenHeaderValidator,
    requireToken,
    paramsLinkValidator,
    removeLink
);

router.patch(
    "/:id",
    requireToken,
    paramsLinkValidator,
    bodyLinkValidator,
    updateLink
);

router.get("/:nanoLink", getLinks);

export default router;




