import pandas as pd
import numpy as np

original = pd.read_csv('books_original.csv')
books = pd.read_csv('books.csv')
books = books.drop('series_id', axis=1)
books["series"] = original["series_title"]

books.to_csv('books(2).csv')

