def test_get_song_recommendations(client):
    # Test with a sample song_id and query parameters
    response = client.get(
        "api/songs/1/recommendations",
        query_string={"danceability": 0.7, "energy": 0.8, "valence": 0.6},
    )

    assert response.status_code == 200
    data = response.get_json()

    # Add your assertions about the response data
    assert isinstance(data, list)  # or whatever your response structure should be
    # Add more specific assertions based on your expected response
