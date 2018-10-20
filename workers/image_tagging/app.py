import os
import uuid

from flask import Flask
from flask import jsonify
from flask import request
from colorthief import ColorThief

UPLOAD_PATH = '/tmp'

app = Flask(__name__)


def array_to_color_hex(array):
    return '#' + ''.join([hex(x)[2:] for x in array])


@app.route('/', methods=['POST'])
def tag_image():
    if request.files and 'file' in request.files:
        file = request.files['file']
        counter = 0
        while True:
            filename = str(uuid.uuid4())
            if not os.path.isfile(os.path.join(UPLOAD_PATH, filename)):
                file.save(dst=os.path.join(UPLOAD_PATH, filename))
                break

            counter = counter + 1
            if counter >= 10:
                return jsonify({'error', 'Couldn\'t save file, try again later'}), 500

        try:
            ct = ColorThief(os.path.join(UPLOAD_PATH, filename))
            dominant_color = ct.get_color(quality=1)
            palette = ct.get_palette(color_count=6)

            dominant_color_hex = array_to_color_hex(dominant_color)
            palette_hex = []
            for line in palette:
                palette_hex.append(array_to_color_hex(line))

        except Exception as ex:
            os.remove(os.path.join(UPLOAD_PATH, filename))
            return jsonify({'errors': ex.args}), 500

        os.remove(os.path.join(UPLOAD_PATH, filename))
        return jsonify({
            'dominant_color': dominant_color_hex,
            'palette': palette_hex
        })
    else:
        return jsonify({
            'error': 'please provide a file'
        }), 400


if __name__ == '__main__':
    app.run(
        port=os.getenv('PORT', 5000),
        debug=os.getenv('DEBUG', False)
    )
