import { useState } from "react"

// Search form: an input field + button
// Captures what the user types and passes it to the paren via onSearch
function SearchBar({ onSearch }) {
    // Holds current text in the input field
    const [searchTerm, setSearchTerm] = useState("")

    // Update the searchTerm state when the user types in the input field
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault() // Prevent page reload
        onSearch(searchTerm) // pass the typed term to the parent
    }
  
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button type="submit">Search</button>
        </form>
    )
}

export default SearchBar