import { uploadMiddleware } from '../middlewares/upload.js'; // tu middleware multer
import { Router } from 'express'

export default(config) => {
    /**
    * Express router to mount user related functions on.
    * @type {Object}
    * @const
    * @namespace placeRouter
    */
    const router = Router()
    const hasAddLinks = config.environment !== 'production'

    // Single file upload route
    router.post(
        '/upload', 
        uploadMiddleware('file'), 
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res));

    // Multiple file upload route
    router.post(
        '/upload-multiple', 
        uploadMiddleware('file', true),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

}
