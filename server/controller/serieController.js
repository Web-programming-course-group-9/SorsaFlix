import { getSerieById } from "../models/serieModel.js"

// reads the id from request, calls the model, sends the result back

export async function fetchSerieById(req, res, next) {
    try {
    // grab id from URL
    const { seriesId } = req.params

    // Ask model for the data
    const serie = await getSerieById(seriesId)

    // send it to the client as JSON
    res.status(200).json(serie)
    } catch(error) {
    next(error)
    }
}