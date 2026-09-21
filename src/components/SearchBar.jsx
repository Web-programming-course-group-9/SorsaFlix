import { useState } from "react"

// Search form: an input field + button
// Captures what the user types and passes it to the paren via onSearch
function SearchBar({ onSearch }) {
    // Holds current text in the input field
    const [searchTerm, setSearchTerm] = useState("")
    // Holds current text in the year field
    const [year, setYear] = useState("")
    // Holds current search type (movie or tv)
    const [searchType, setSearchType] = useState("movie")

    // Update the searchTerm state when the user types in the input field
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleYearChange = (event) => {
        setYear(event.target.value)
    }

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault() // Prevent page reload
        onSearch({ query: searchTerm, year: year, type: searchType }) // pass the typed term to the parent
    }
  
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="Year..."
                value={year}
                onChange={handleYearChange}
            />
            <select value={searchType} onChange={(event) => setSearchType(event.target.value)}>
                <option value="movie">Movies</option>
                <option value="tv">Series</option>
            </select>
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchBar
