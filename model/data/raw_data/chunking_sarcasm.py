import pandas as pd

df = pd.read_csv('train-balanced-sarcasm.csv')
chunk_size = len(df) // 6
base_filename = 'train-balanced-sarcasm.csv'

for i in range(6):
    start_idx = i * chunk_size
    if i == 5:
        end_idx = len(df)
    else:
        end_idx = (i + 1) * chunk_size
    chunk = df.iloc[start_idx:end_idx]
    
    chunk_filename = base_filename.replace('.csv', f'_chunk{i+1}.csv')
    chunk.to_csv(chunk_filename, index=False)
