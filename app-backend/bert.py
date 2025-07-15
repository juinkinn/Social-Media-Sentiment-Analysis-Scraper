from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
from huggingface_hub import login
import os
from dotenv import load_dotenv
import re
import unicodedata
import emoji
from openai import OpenAI

load_dotenv()
checkpoint = "GaaS-Team/DistilBERT-finetuned-GaaS"
hf_token = os.getenv("HUGGINGFACE_TOKEN")
tokenizer = AutoTokenizer.from_pretrained(checkpoint, use_auth_token=hf_token)
model = AutoModelForSequenceClassification.from_pretrained(checkpoint, use_auth_token=hf_token)

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

def getBertSentiment(raw_text: str):
    text = normalize_text(raw_text)
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")

    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_class_ids = logits.argmax(dim=-1).tolist()
    predicted_classes = [model.config.id2label[id] for id in predicted_class_ids]
    return predicted_classes[0]


def getGptSentiment(raw_text: str, game: str):
    client = OpenAI(api_key=os.getenv("GPT_KEY"))
    
    try:
        client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello"}]
        )
        prompt = (
            'Your role is do sentiment analysis on comments from social medias on topic relating to video games.\n'

            'Note that the comments are in English and can sometimes be sarcastic.\n'

            'If the comment is positive, return the number "POSITIVE"\n'

            'If the comment is negative, return the number "NEGATIVE"\n'

            'Return only the sentiment result and nothing else.\n'

            'The game is: ' + game + '\n'

            'Here is the comment:\n'

            f'{raw_text}\n'
        )

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        return completion.choices[0].message.content
    except:
        print("Error: GPT-4o-mini model is not available. Please check your OpenAI API key and model availability.")
        return None

def getSentiment(game, raw_text: str, mode = "BERT"):
    if mode == "BERT":
        return getBertSentiment(raw_text)
    else:
        return getGptSentiment(raw_text, game)

