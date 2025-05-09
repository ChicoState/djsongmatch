# Retired - recommendations are now generated using FAISS Approximate Nearest Neighbors
# which can be found in index.py

# """
# Song Clustering Script

# Automatically groups songs into clusters using K-Means based on audio features, 
# persisting both database assignments and the trained model for recommendations.

# Key Features:
# - Batch processing with resume capability for interrupted jobs
# - Progress tracking with automatic recovery
# - Reproducible results (fixed random seed)
# - Efficient bulk database updates
# - Model and cluster persistence for recommendation service

# Usage:
#     # Full clustering (initial run)
#     python3 -m backend.scripts.cluster
    
#     # Resume partial clustering
#     python3 -m backend.scripts.cluster --resume

# Requirements:
# - Pre-populated songs table with audio features
# - Active Flask application context
# """

# import os
# import pickle
# import argparse
# import pandas as pd
# from sklearn.cluster import KMeans
# from sqlalchemy.exc import OperationalError

# from backend.api import create_app
# from backend.api.database.models import Song
# from backend.api.extensions import db

# # PARAMETERS – feel free to adjust (e.g., number of clusters)
# N_CLUSTERS = 6
# FEATURE_COLS = [
#     'danceability', 'energy', 'loudness', 'speechiness',
#     'acousticness', 'instrumentalness', 'liveness', 'valence'
# ]
# SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_FILENAME = os.path.join(SCRIPT_DIR, "../assets/kmeans_model.pkl")

# def run_clustering(resume=False):
#     """Run clustering with resume support using proper SQLAlchemy Core transactions"""
#     app = create_app()
#     with app.app_context():
#         try:
#             # Query construction with resume logic
#             query = Song.query.order_by(Song.song_id)
#             if resume:
#                 print("Resuming - only clustering unassigned songs")
#                 query = query.filter(Song.cluster.is_(None))
            
#             songs = query.all()
#             if not songs:
#                 print("No songs found to cluster!")
#                 return

#         except OperationalError as e:
#             print(f"Database connection error: {e}")
#             return

#         # Data preparation (unchanged)
#         data = {col: [] for col in ['song_id'] + FEATURE_COLS}
#         for s in songs:
#             data['song_id'].append(s.song_id)
#             for col in FEATURE_COLS:
#                 data[col].append(getattr(s, col))

#         df = pd.DataFrame(data)
#         X = df[FEATURE_COLS].values

#         # Clustering execution
#         model = KMeans(n_clusters=N_CLUSTERS, random_state=42)
#         clusters = model.fit_predict(X)
#         print(f"Clustering complete. Cluster assignment counts: {pd.Series(clusters).value_counts().to_dict()}")

#         # Save model
#         with open(MODEL_FILENAME, "wb") as f:
#             pickle.dump(model, f)
#         print(f"Model saved to {MODEL_FILENAME}")

#         # Prepare updates with resume logic
#         cluster_updates = [
#             {"b_song_id": song.song_id, "b_cluster": int(cluster_label)}
#             for song, cluster_label in zip(songs, clusters)
#             if not resume or song.cluster is None
#         ]

#         print(f"Updating {len(cluster_updates)} songs...")

#         # Transaction and batch processing setup
#         BATCH_SIZE = 500
#         progress_file = os.path.join(SCRIPT_DIR, "cluster_progress.txt")
#         start_batch = 0

#         # Resume logic
#         if resume and os.path.exists(progress_file):
#             try:
#                 with open(progress_file, "r") as f:
#                     start_batch = int(f.read().strip())
#                 print(f"Resuming from batch {start_batch//BATCH_SIZE + 1}")
#             except Exception as e:
#                 print(f"Couldn't read progress file: {e}")

#         try:
#             with db.engine.connect() as connection:
#                 # Begin transaction
#                 trans = connection.begin()
                
#                 for i in range(start_batch, len(cluster_updates), BATCH_SIZE):
#                     batch = cluster_updates[i:i + BATCH_SIZE]
                    
#                     # Execute batch update
#                     connection.execute(
#                         Song.__table__.update()
#                         .where(Song.song_id == db.bindparam("b_song_id"))
#                         .values(cluster=db.bindparam("b_cluster")),
#                         batch
#                     )
                    
#                     # Commit every 3 batches to prevent timeouts
#                     if i > 0 and i % (3 * BATCH_SIZE) == 0:
#                         trans.commit()
#                         trans = connection.begin()
                    
#                     # Update progress
#                     with open(progress_file, "w") as f:
#                         f.write(str(i + BATCH_SIZE))
#                     print(f"Updated batch {i//BATCH_SIZE + 1} of {len(cluster_updates)//BATCH_SIZE + 1}")
                
#                 # Final commit
#                 trans.commit()
                
#                 # Clean up progress file
#                 if os.path.exists(progress_file):
#                     os.remove(progress_file)
#                 print("✅ Database update complete!")

#         except Exception as e:
#             print(f"❌ Error during batch {i//BATCH_SIZE + 1}: {e}")
#             try:
#                 if 'trans' in locals():
#                     trans.rollback()
#             except Exception as rollback_error:
#                 print(f"Rollback failed: {rollback_error}")
#             return

# if __name__ == "__main__":
#     # Set up command-line arguments
#     parser = argparse.ArgumentParser()
#     parser.add_argument("--resume", action="store_true", help="Only cluster unassigned songs")
#     args = parser.parse_args()

#     print("Starting clustering...")
#     run_clustering(resume=args.resume)