from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
from huggingface_hub import login
import os
from dotenv import load_dotenv
import re
import unicodedata
import emoji

def normalize_text(text):
    text = text.lower()  # lowercase

    # remove 'early access review' at the beginning
    text = re.sub(r"^(early access review[\s:\-–—)]*)", "", text, flags=re.IGNORECASE)

    # remove URLs, mentions, hashtags
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#\w+", "", text)

    # remove numbers
    #text = re.sub(r"\d+", "", text)

    # remove emojis and icons
    text = emoji.replace_emoji(text, replace='')
    
    # remove non-printable or control characters + double quotes
    text = ''.join(
        c for c in text 
        if unicodedata.category(c)[0] != 'C' and c.isprintable() and c != '"'
    )

    # normalize whitespace
    text = re.sub(r"\s+", " ", text)

    # remove duplicate consecutive words
    text = re.sub(r'\b(\w+)( \1\b)+', r'\1', text)

    # keep only ASCII characters (English text only)
    text = text.encode("ascii", "ignore").decode()

    return text.strip()

def getSentiment(raw_text: str):
#     text = normalize_text(raw_text)

#     load_dotenv()
#     hf_token=os.getenv("HUGGINGFACE_TOKEN")


#     checkpoint = "GaaS-Team/DistilBERT-finetuned-GaaS"  # Example checkpoint for sentiment analysis
#     tokenizer = AutoTokenizer.from_pretrained(checkpoint)
#     model = AutoModelForSequenceClassification.from_pretrained(checkpoint, token=hf_token)

#     inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")

#     # Run inference
#     with torch.no_grad():
#         logits = model(**inputs).logits

#     # Get predicted classes
#     predicted_class_ids = logits.argmax(dim=-1).tolist()
#     predicted_classes = [model.config.id2label[id] for id in predicted_class_ids]
#     return predicted_classes[0]
    return 'POSITIVE'

