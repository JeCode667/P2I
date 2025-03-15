from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)

# Charger le modèle
model_name = "ton_modele_finetune"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    question = data.get("message", "")

    # Génération de réponse
    inputs = tokenizer(question, return_tensors="pt")
    with torch.no_grad():
        output = model.generate(**inputs, max_length=150)
    response = tokenizer.decode(output[0], skip_special_tokens=True)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
