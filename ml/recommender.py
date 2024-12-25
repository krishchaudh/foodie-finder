# foodie-finder/ml/recommender.py

import psycopg2
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

DB_HOST = 'localhost'
DB_USER = 'postgres'
DB_PASS = 'example'
DB_NAME = 'foodiefinder'

def fetch_reviews():
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )
    df = pd.read_sql_query("SELECT user_id, restaurant_id, rating FROM reviews", conn)
    conn.close()
    return df

def store_recommendations(recs):
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        dbname=DB_NAME
    )
    cur = conn.cursor()
    # Clear old data
    cur.execute("DELETE FROM ml_recommendations")
    # Insert new data
    for user_id, items in recs.items():
        for (restaurant_id, score) in items:
            cur.execute(
                "INSERT INTO ml_recommendations (user_id, restaurant_id, score) VALUES (%s, %s, %s)",
                (user_id, restaurant_id, float(score))
            )
    conn.commit()
    cur.close()
    conn.close()

def main():
    df = fetch_reviews()
    if df.empty:
        print("No reviews found. Exiting.")
        return

    # Pivot table -> rows = user_id, columns = restaurant_id, values = rating
    rating_matrix = df.pivot_table(index='user_id', columns='restaurant_id', values='rating').fillna(0)

    # Cosine similarity between users
    user_sim = cosine_similarity(rating_matrix.values)
    user_sim_df = pd.DataFrame(user_sim, index=rating_matrix.index, columns=rating_matrix.index)

    # Generate top-N recommendations for each user
    # We'll do a naive approach: weighted average of ratings from similar users
    recommendations = {}
    for user in rating_matrix.index:
        # Get user similarity scores
        sim_scores = user_sim_df.loc[user]
        # Weighted rating for each restaurant
        # rating_matrix.T transforms matrix so we can multiply each row (restaurant) by similarity scores
        weighted_ratings = rating_matrix.T.dot(sim_scores) / (sim_scores.sum() + 1e-9)
        # Exclude items the user already rated
        user_rated = rating_matrix.loc[user]
        weighted_ratings[user_rated > 0] = 0  # zero out already rated
        # Sort descending
        top_restaurants = weighted_ratings.sort_values(ascending=False).head(5).index
        top_scores = weighted_ratings.sort_values(ascending=False).head(5).values
        recommendations[user] = list(zip(top_restaurants, top_scores))

    store_recommendations(recommendations)
    print("Recommendations stored in ml_recommendations table.")

if __name__ == "__main__":
    main()
