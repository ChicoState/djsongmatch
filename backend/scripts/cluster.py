
# cluster.py
import os
import pickle
import pandas as pd
from sklearn.cluster import KMeans

from backend.api import create_app
from backend.api.database.models import Song
from backend.api.extensions import db

# PARAMETERS – feel free to adjust (e.g., number of clusters)
N_CLUSTERS = 5
FEATURE_COLS = ['danceability', 'energy', 'loudness']
MODEL_FILENAME = "kmeans_model.pkl"

def run_clustering():
    app = create_app()
    with app.app_context():
        # Query all songs from the database
        songs = Song.query.order_by(Song.song_id).all()
        if not songs:
            print("No songs found in the database. Seed your songs first!")
            return

        # Build a DataFrame with necessary features
        data = {
            "song_id": [],
            "danceability": [],
            "energy": [],
            "loudness": []
        }
        for s in songs:
            data["song_id"].append(s.song_id)
            data["danceability"].append(s.danceability)
            data["energy"].append(s.energy)
            data["loudness"].append(s.loudness)

        df = pd.DataFrame(data)
        X = df[FEATURE_COLS].values

        # Run KMeans clustering
        model = KMeans(n_clusters=N_CLUSTERS, random_state=42)
        clusters = model.fit_predict(X)
        print(f"Clustering complete. Cluster assignment counts: {pd.Series(clusters).value_counts().to_dict()}")

        # Update each Song’s cluster attribute in the DB – assumes order of songs and dataframe match
        for song, cluster_label in zip(songs, clusters):
            song.cluster = int(cluster_label)

        # Save the clustering model to a pickle file for later use (e.g., recommendation service)
        with open(MODEL_FILENAME, "wb") as f:
            pickle.dump(model, f)
        print(f"Model saved to {MODEL_FILENAME}")

        db.session.commit()
        print("Database updated with new cluster assignments.")

if __name__ == "__main__":
    run_clustering()