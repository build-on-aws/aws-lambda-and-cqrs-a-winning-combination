all: install

install:
	virtualenv .env --python=python3
	curl -sS https://bootstrap.pypa.io/get-pip.py | .env/bin/python
	.env/bin/python -m pip install -r requirements.txt
	npm install --global npm

clean:
	rm -rf .env/
