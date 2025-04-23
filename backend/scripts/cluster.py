
# cluster.py
import os
import pickle
import pandas as pd
from sklearn.cluster import KMeans
from sqlalchemy.exc import OperationalError

from backend.api import create_app
from backend.api.database.models import Song
from backend.api.extensions import db

# PARAMETERS – feel free to adjust (e.g., number of clusters)
N_CLUSTERS = 6
FEATURE_COLS = [
    'danceability', 'energy', 'loudness', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence'
]
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
MODEL_FILENAME = os.path.join(SCRIPT_DIR, "../assets/kmeans_model.pkl")  # Adjust relative path

def run_clustering():
    app = create_app()
    with app.app_context():
        try:
            # Query all songs from the database
            songs = Song.query.order_by(Song.song_id).all()
            if not songs:
                print("No songs found in the database. Seed your songs first!")
                return
        except OperationalError as e:
            print(f"Database connection error: {e}")
            return

        # Build a DataFrame with necessary features
        data = {
            "song_id": [],
            "danceability": [],
            "energy": [],
            "loudness": [],
            "speechiness": [],
            "acousticness": [],
            "instrumentalness": [],
            "liveness": [],
            "valence": []
        }
        for s in songs:
            data["song_id"].append(s.song_id)
            data["danceability"].append(s.danceability)
            data["energy"].append(s.energy)
            data["loudness"].append(s.loudness)
            data["speechiness"].append(s.speechiness)
            data["acousticness"].append(s.acousticness)
            data["instrumentalness"].append(s.instrumentalness)
            data["liveness"].append(s.liveness)
            data["valence"].append(s.valence)

        df = pd.DataFrame(data)
        X = df[FEATURE_COLS].values

        # Run KMeans clustering
        model = KMeans(n_clusters=N_CLUSTERS, random_state=42)
        clusters = model.fit_predict(X)
        print(f"Clustering complete. Cluster assignment counts: {pd.Series(clusters).value_counts().to_dict()}")

        # Save the clustering model to a pickle file for later use (e.g., song recommendation service)
        with open(MODEL_FILENAME, "wb") as f:
            pickle.dump(model, f)
        print(f"Model saved to {MODEL_FILENAME}")

        # Prepare bulk update data for use in updating database
        cluster_updates = []
        for song, cluster_label in zip(songs, clusters):
            cluster_updates.append({"b_song_id": song.song_id, "b_cluster": int(cluster_label)})

        print("Updating database. Note: May take a few minutes!")

        # Batch size for updates
        BATCH_SIZE = 1000

        # Perform batch updates
        try:
            with db.engine.connect() as connection:
                for i in range(0, len(cluster_updates), BATCH_SIZE):
                    batch = cluster_updates[i:i + BATCH_SIZE]
                    connection.execute(
                        Song.__table__.update()
                        .where(Song.song_id == db.bindparam("b_song_id"))
                        .values(cluster=db.bindparam("b_cluster")),
                        batch
                    )
                    print(f"Updated batch {i // BATCH_SIZE + 1} of {len(cluster_updates) // BATCH_SIZE + 1}")
            print("Database updated with new cluster assignments.")
        except Exception as e:
            print(f"Error during bulk update: {e}")
            db.session.rollback()
            return

        # Option 2
        # # Use raw SQL for bulk update
        # try:
        #     with db.engine.connect() as connection:
        #         connection.execute(
        #             Song.__table__.update()
        #             .where(Song.song_id == db.bindparam("b_song_id"))
        #             .values(cluster=db.bindparam("b_cluster")),
        #             cluster_updates
        #         )
        #     print("Database updated with new cluster assignments.")
        # except Exception as e:
        #     print(f"Error during bulk update: {e}")
        #     db.session.rollback()
        #     return
        
        # Option 3
        # Prepare bulk update data for use in updating database
        # cluster_updates = []
        # for song, cluster_label in zip(songs, clusters):
        #     cluster_updates.append({"song_id": song.song_id, "cluster": int(cluster_label)})
        # # Perform bulk update
        # db.session.bulk_update_mappings(Song, cluster_updates)

        # # print("Committing cluster assignments to database...")
        # db.session.commit()
        # print("Database updated with new cluster assignments.")

if __name__ == "__main__":
    run_clustering()