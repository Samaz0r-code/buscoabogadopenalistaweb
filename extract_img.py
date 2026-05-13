import re
import base64
import os

with open("c:\\Users\\samaz\\OneDrive\\Escritorio\\G&V\\WEBS\\modo-nocturno-guardia (2).html", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'src="data:image/jpeg;base64,([^"]+)"', content)
if match:
    b64_data = match.group(1)
    img_data = base64.b64decode(b64_data)
    with open("c:\\Users\\samaz\\OneDrive\\Escritorio\\G&V\\WEBS\\urgencia\\hero-urgencia.jpg", "wb") as img_file:
        img_file.write(img_data)
    print("Extracted base64 image successfully to urgencia/hero-urgencia.jpg")
else:
    print("Could not find base64 image.")

