import json
import faiss
import numpy as np
import os
from sentence_transformers import SentenceTransformer
from transformers import GPT2Tokenizer, GPT2LMHeadModel, AutoModelForCausalLM, AutoTokenizer
from tqdm import tqdm

def load_wikipedia_dataset(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [entry["title"] + ": " + entry["summary"] for entry in data]

def create_faiss_index(documents, model, index_path="faiss_index.bin"):
    if os.path.exists(index_path):
        index = faiss.read_index(index_path)
        print("Index FAISS chargé depuis le fichier.")
    else:
        print("Création d'un nouvel index FAISS...")
        doc_vectors = np.array([model.encode(doc) for doc in tqdm(documents, desc="Vectorisation des documents")])
        index = faiss.IndexFlatL2(doc_vectors.shape[1])
        index.add(doc_vectors)
        faiss.write_index(index, index_path)
        print("Index FAISS enregistré.")
    return index

def search_relevant_passages(query, index, documents, model, k=1):
    query_vector = np.array(model.encode([query]))
    distances, indices = index.search(query_vector, k)
    return [documents[i] for i in indices[0]]

def generate_response(prompt, context, model, tokenizer):
    full_prompt = (
               f"Exemple :\n"
               f"Informations disponibles : Jules César: Jules César, aussi simplement appelé César, est un conquérant, homme d'État et écrivain romain, né le 12 ou le 13 juillet 100 av. J.-C. à Rome et mort le 15 mars 44 av. J.-C. dans la même ville.\n"
               f"Explique en détail la réponse à cette question : Quand est né Jules César ?\n"
               f"Réponse : Jules César est né en -100.\n\n"
               f"Informations disponibles : {context}\n"
               f"Explique en détail la réponse à cette question : {prompt}\n"
               f"Réponse :")
    inputs = tokenizer.encode(full_prompt, return_tensors="pt")
    outputs = model.generate(inputs, do_sample=True, temperature=0.3,  # Plus bas = moins de créativité
        top_p=0.9,  # Garde les mots les plus probables
        top_k=50,   # Réduit l'exploration de mots rares
        repetition_penalty=1.2,  # Évite la répétition
        )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def generate_long_response(prompt, context, model, tokenizer, num_chunks=3):
    response = ""
    full_prompt = (
        f"Exemple :\n"
        f"Informations disponibles : Jules César: Jules César, aussi simplement appelé César, est un conquérant, homme d'État et écrivain romain, né le 12 ou le 13 juillet 100 av. J.-C. à Rome et mort le 15 mars 44 av. J.-C. dans la même ville.\n"
        f"Explique en détail la réponse à cette question : Quand est né Jules César ?\n"
        f"Réponse : Jules César est né en -100.\n\n"
        f"Informations disponibles : {context}\n"
        f"Explique en détail la réponse à cette question : {prompt}\n"
        f"Réponse :")
    for _ in range(num_chunks):  # Générer en plusieurs parties
        inputs = tokenizer.encode(full_prompt + response, return_tensors="pt")
        outputs = model.generate(inputs, do_sample=True, temperature=0.3,  # Plus bas = moins de créativité
        top_p=0.9,  # Garde les mots les plus probables
        top_k=50,   # Réduit l'exploration de mots rares
        repetition_penalty=1.2,  # Évite la répétition
        )
        response += tokenizer.decode(outputs[0], skip_special_tokens=True) + " "
    return response

def main():
    # Étape 1: Chargement des articles Wikipédia
    dataset_path = "dataset.json"  # Modifier si nécessaire
    documents = load_wikipedia_dataset(dataset_path)
    
    # Étape 2: Indexation avec FAISS
    model = SentenceTransformer("all-MiniLM-L6-v2")
    index = create_faiss_index(documents, model)
    
    # Étape 3: Recherche des passages pertinents
    query = "Quand est né Jules César ?"
    relevant_passages = search_relevant_passages(query, index, documents, model)
    context = " ".join(relevant_passages)
    
    # Étape 4: Génération avec GPT-2

    use_advanced_model = False  # Passer à True pour tester un modèle plus puissant
    if use_advanced_model:
        model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
        gpt_model = AutoModelForCausalLM.from_pretrained(model_name)
        tokenizer = AutoTokenizer.from_pretrained(model_name)
    else:
        gpt_model = GPT2LMHeadModel.from_pretrained("gpt2-large")
        tokenizer = GPT2Tokenizer.from_pretrained("gpt2-large")

    response = generate_response(query, context, gpt_model, tokenizer)

    print( response)

if __name__ == "__main__":
    main()

