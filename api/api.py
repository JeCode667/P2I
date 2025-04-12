from flask import Flask, request, jsonify
from flask_cors import CORS  # Import du module CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import json
import faiss
import numpy as np
import os
from sentence_transformers import SentenceTransformer
import re

app = Flask(__name__)
CORS(app)  # Active CORS pour toutes les routes

# Chemins des fichiers
INDEX_PATH = "faiss_index.bin"
DOCUMENT_PATH = "dataset.json"

# Charger le modèle

tokenizer_trained = AutoTokenizer.from_pretrained("models/checkpoint-40064")
model_trained = AutoModelForCausalLM.from_pretrained("models/checkpoint-40064")

tokenizer_gpt2 = AutoTokenizer.from_pretrained("gpt2")
model_gpt2 = AutoModelForCausalLM.from_pretrained("gpt2")

def load_wikipedia_dataset(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [entry["title"] + ": " + entry["summary"] for entry in data]

# Charger FAISS et les documents associés
if os.path.exists(INDEX_PATH) and os.path.exists(DOCUMENT_PATH):
    index = faiss.read_index(INDEX_PATH)
    document = load_wikipedia_dataset(DOCUMENT_PATH)
    print("Index FAISS et documents chargés avec succès.")
else:
    raise FileNotFoundError("Fichier FAISS ou documents non trouvés. Assurez-vous de les générer avant d'exécuter l'API.")

# Charger SentenceTransformer pour les requêtes
sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

# Recherche des passages les plus pertinents
def search_relevant_passages(query, index, documents, model, k=1):
    query_vector = np.array(model.encode([query]))
    distances, indices = index.search(query_vector, k)
    results = [documents[i] for i in indices[0] if i < len(documents)]
    return "\n".join(results)

def extract_generated_text(text, keyword="réponse:"):
    match = re.search(rf"{re.escape(keyword)}\s*(.*)", text, re.DOTALL)
    return match.group(1).strip() if match else text

def generate_answer(prompt, model, tokenizer, max_tokens=50):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=max_tokens, pad_token_id=tokenizer.eos_token_id)
    full_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    generated_response = extract_generated_text(full_text)
    return generated_response

@app.route("/chat/gpt2", methods=["POST"])
def chat_gpt2():
    data = request.json
    question = data.get("message", "")
    
    prompt = question + "Réponse :"

    response = generate_answer(prompt, model_gpt2, tokenizer_gpt2, max_tokens=50)

    return jsonify({"response": response})

@app.route("/chat/rag/trained", methods=["POST"])
def chat_rag_trained():
    data = request.json
    question = data.get("message", "")

    context = search_relevant_passages(question, index, document, sentence_model)
    
    prompt = f"question: {question} contexte: {context}\nréponse:"
    
    response = generate_answer(prompt, model_trained, tokenizer_trained, max_tokens=100)

    return jsonify({"response": response})

@app.route("/chat/rag/gpt2", methods=["POST"])
def chat_rag_gpt2():
    data = request.json
    question = data.get("message", "")

    context = search_relevant_passages(question, index, document, sentence_model)
    
    prompt = f"question: {question} contexte: {context}\nréponse:"
    
    response = generate_answer(prompt, model_gpt2, tokenizer_gpt2, max_tokens=100)

    return jsonify({"response": response})

@app.route("/chat", methods=["GET"])
def chat():
    return "Chatbot API is running!"

if __name__ == "__main__":
    app.run(debug=True)
