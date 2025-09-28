# Plant Identification Script

This script uses a pre-trained MobileNetV2 model to identify plants in images.

## Requirements

- Python 3.8 or higher
- Dependencies listed in requirements.txt

## Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the script with an image path as an argument:
```bash
python identify_plant.py path/to/your/image.jpg
```

The script will output a JSON response with the identification results:
```json
{
    "success": true,
    "predictions": [
        {
            "class": "plant_class_name",
            "confidence": 0.95
        }
    ]
}
```

## Notes

- The script uses MobileNetV2 pre-trained on ImageNet
- Images are resized to 224x224 pixels before processing
- The model returns the top 5 predictions with their confidence scores
- If no plant-related predictions are found, it returns the top prediction regardless of class 