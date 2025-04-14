from flask import Flask, request, jsonify
from flask_cors import CORS  # Permet les requêtes cross-origin
from transformers import GPT2LMHeadModel, AutoTokenizer
import torch
import json
import faiss
import numpy as np
import os
from sentence_transformers import SentenceTransformer
import re

app = Flask(__name__)
CORS(app)  # Active CORS pour permettre les requêtes depuis d'autres domaines

import os

model_dir = "model"
output_file = os.path.join(model_dir, "model.safetensors")

# Si le modèle n'est pas encore reconstruit
if not os.path.exists(output_file):
    print("🔁 Reconstruction du fichier model.safetensors...")

    with open(output_file, 'wb') as outfile:
        part_index = 0
        while True:
            part_filename = os.path.join(model_dir, f"model.safetensors.part{part_index:03d}")
            if not os.path.exists(part_filename):
                break  # plus de fichiers
            print(f"📦 Ajout de {part_filename}")
            with open(part_filename, 'rb') as infile:
                outfile.write(infile.read())
            part_index += 1

    print(f"✅ Reconstruction terminée : {output_file}")
else:
    print("📂 Fichier model.safetensors déjà présent.")


# Charger les modèles
tokenizer_trained = AutoTokenizer.from_pretrained(model_dir)
model_trained = GPT2LMHeadModel.from_pretrained(model_dir, use_safetensors=True)
model_trained.resize_token_embeddings(len(tokenizer_trained))

tokenizer_gpt2 = AutoTokenizer.from_pretrained("openai-community/gpt2-medium")
model_gpt2 = GPT2LMHeadModel.from_pretrained("openai-community/gpt2-medium")
model_gpt2.resize_token_embeddings(len(tokenizer_gpt2))

sentence_model = SentenceTransformer("all-MiniLM-L6-v2")

# Chemins des fichiers pour FAISS et les documents
INDEX_PATH = "faiss_index.bin"
DOCUMENT_PATH = "dataset.json"


def load_wikipedia_dataset(file_path):
    """Charge les documents depuis un fichier JSON."""
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

def search_relevant_passages(query, index, documents, model, k=1):
    """
    Recherche les passages les plus pertinents dans les documents
    en utilisant FAISS et SentenceTransformer.
    """
    query_vector = np.array(model.encode([query]))
    distances, indices = index.search(query_vector, k)
    results = [documents[i] for i in indices[0] if i < len(documents)]
    return "\n".join(results)

def extract_generated_text(text, keyword="réponse:"):
    """
    Extrait la réponse générée après un mot-clé spécifique.
    """
    match = re.search(rf"{re.escape(keyword)}\s*(.*)", text, re.DOTALL)
    return match.group(1).strip() if match else text

def extract_first_sentence(text):
    """
    Extrait la première phrase d'un texte tout en gérant les abréviations.
    """
    abbrev_map = {
        "av. J.-C.": "av[STOP]J.-C[STOP]",
        "apr. J.-C.": "apr[STOP]J.-C[STOP]",
        "etc.": "etc[STOP]",
        "M. ": "M[STOP] ",
        "Mme. ": "Mme[STOP] ",
        "Dr. ": "Dr[STOP] ",
        "Prof. ": "Prof[STOP] ",
    }

    for abbr, replacement in abbrev_map.items():
        text = text.replace(abbr, replacement)

    split = re.split(r"(?<=[.!?])\s+", text)
    first = split[0].strip()

    for abbr, replacement in abbrev_map.items():
        first = first.replace(replacement, abbr)

    if not first.endswith(('.', '!', '?')):
        first += '.'

    return first

def generate_answer(prompt, model, tokenizer, max_tokens=50):
    """
    Génère une réponse à partir d'un prompt en utilisant un modèle de langage.
    """
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=max_tokens, pad_token_id=tokenizer.eos_token_id)
    full_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    generated_response = extract_generated_text(full_text)
    shortened_response = extract_first_sentence(generated_response)
    return shortened_response

@app.route("/chat/gpt2", methods=["POST"])
def chat_gpt2():
    """
    Endpoint pour interagir avec le modèle GPT-2.
    """
    data = request.json
    question = data.get("message", "")
    prompt = question + "Réponse :"
    response = generate_answer(prompt, model_gpt2, tokenizer_gpt2, max_tokens=50)
    return jsonify({"response": response})

@app.route("/chat/rag/trained", methods=["POST"])
def chat_rag_trained():
    """
    Endpoint pour interagir avec le modèle RAG entraîné.
    """
    data = request.json
    question = data.get("message", "")
    context = search_relevant_passages(question, index, document, sentence_model)
    prompt = f"question: {question} contexte: {context}\nréponse:"
    response = generate_answer(prompt, model_trained, tokenizer_trained, max_tokens=100)
    return jsonify({"response": response})

@app.route("/chat/rag/gpt2", methods=["POST"])
def chat_rag_gpt2():
    """
    Endpoint pour interagir avec le modèle RAG basé sur GPT-2.
    """
    data = request.json
    question = data.get("message", "")
    context = search_relevant_passages(question, index, document, sentence_model)
    prompt = f"question: {question} contexte: {context}\nréponse:"
    response = generate_answer(prompt, model_gpt2, tokenizer_gpt2, max_tokens=100)
    return jsonify({"response": response})

@app.route("/chat", methods=["GET"])
def chat():
    """
    Endpoint de test pour vérifier que l'API fonctionne.
    """
    return "Chatbot API is running!"

# Lancer l'application Flask
if __name__ == "__main__":
    app.run(debug=True)
