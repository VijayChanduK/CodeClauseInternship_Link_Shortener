package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ShortenRequest struct {
	URL string `json:"url"`
}

type ShortenResponse struct {
	ShortUrl string `json:"shortUrl"`
}

func shortenHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ShortenRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	shortUrl := "http://localhost:5000/s/" + "xyz123" // Dummy short URL
	res := ShortenResponse{ShortUrl: shortUrl}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func main() {
	http.HandleFunc("/api/shorten", shortenHandler)

	fmt.Println("Server running on port 5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}
