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
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained("models/checkpoint_2")
model = AutoModelForCausalLM.from_pretrained("models/checkpoint_2")

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
def search_relevant_passages(query, index, documents, model, k=2):
    query_vector = np.array(model.encode([query]))
    distances, indices = index.search(query_vector, k)
    results = [documents[i] for i in indices[0] if i < len(documents)]
    return "\n".join(results)

def extract_generated_text(text, keyword="Réponse :"):
    match = re.search(rf"{re.escape(keyword)}\s*(.*)", text, re.DOTALL)
    return match.group(1).strip() if match else text

def generate_response(prompt, model, tokenizer):
    inputs = tokenizer(prompt, return_tensors="pt")
    with torch.no_grad():
        output = model.generate(**inputs, do_sample=True, temperature=0.3,  # Plus bas = moins de créativité
        top_p=0.9,  # Garde les mots les plus probables
        top_k=50,   # Réduit l'exploration de mots rares
        repetition_penalty=1.2, )
    full_text = tokenizer.decode(output[0], skip_special_tokens=True)
    generated_response = extract_generated_text(full_text)
    return generated_response

@app.route("/chat/gpt2", methods=["POST"])
def chat_gpt2():
    data = request.json
    question = data.get("message", "")

    response = generate_response(question + "Réponse :", model, tokenizer)

    return jsonify({"response": response})

@app.route("/chat/rag", methods=["POST"])
def chat_rag():
    data = request.json
    question = data.get("message", "")

    # Recherche des passages les plus pertinents
    context = search_relevant_passages(question, index, document, sentence_model)

    # Génération de réponse
    full_prompt = (
               f"Exemple :\n"
               f"Informations disponibles : Jules César: Jules César, aussi simplement appelé César, est un conquérant, homme d'État et écrivain romain, né le 12 ou le 13 juillet 100 av. J.-C. à Rome et mort le 15 mars 44 av. J.-C. dans la même ville.\n"
               f"Explique en détail la réponse à cette question : Quand est né Jules César ?\n"
               f"Reponse : Jules César est né en -100.\n\n"
               f"Informations disponibles : {context}\n"
               f"Explique en détail la réponse à cette question : {question}\n"
               f"Réponse : ")
    
    response = generate_response(full_prompt, model, tokenizer)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
