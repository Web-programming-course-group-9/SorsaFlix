import axios from "axios"
import "dotenv/config"

// Fetch one series by ID
// TV serues use /tv/ encpoint
// append_to_response=credits to get cast list
export async function getSerieById(serieId) {
  const response = await axios.get(
    `https://api.themoviedb.org/3/tv/${serieId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`
      },
      params: {
        language: "fi-FI",
        append_to_response: "credits"
      },
    }
  )

  return response.data
}