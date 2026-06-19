.PHONY: install dev build preview lint clean

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

lint:
	npm run lint

clean:
	rm -rf dist node_modules node_modules/.tmp
