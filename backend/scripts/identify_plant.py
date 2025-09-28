import sys
import json
import torch
import timm
import logging
import os
import io

from PIL import Image
from torchvision import transforms

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
logging.getLogger().setLevel(logging.ERROR)

# Globals
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
idx_to_species = {}
species_names = {}
model = None

# Load mappings and model once
def load_model_and_maps():
    global idx_to_species, species_names, model

    with open("Utilities/class_idx_to_species_id.json") as f:
        idx_to_species = json.load(f)
    with open("Utilities/plantnet300K_species_names.json") as f:
        species_names = json.load(f)

    model = timm.create_model("vit_base_patch16_224", pretrained=False)
    in_features = model.head.in_features
    model.head = torch.nn.Linear(in_features, len(idx_to_species))

    checkpoint = torch.load("vit_finetune_newspecies/vit_finetune_best.pth", map_location="cpu")
    model.load_state_dict(checkpoint["model"], strict=False)
    model.to(device).eval()

def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
    ])
    return transform(img).unsqueeze(0).to(device)

def identify_plant(image_path):
    try:
        x = preprocess_image(image_path)
        with torch.no_grad():
            outputs = model(x)
            probs = torch.nn.functional.softmax(outputs, dim=1)
            top5 = torch.topk(probs, k=5, dim=1)

        predictions = []
        for idx_tensor, prob_tensor in zip(top5.indices[0], top5.values[0]):
            idx = idx_tensor.item()
            species_id = idx_to_species.get(str(idx), "Unknown")
            species_name = species_names.get(str(species_id), "Unknown")
            predictions.append({
                "name": species_name,
                "confidence": float(prob_tensor.cpu().item())
            })

        return {"success": True, "predictions": predictions}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({"success": False, "error": "Please provide an image path"}))
        sys.exit(1)

    load_model_and_maps()
    result = identify_plant(sys.argv[1])
    print(json.dumps(result))
