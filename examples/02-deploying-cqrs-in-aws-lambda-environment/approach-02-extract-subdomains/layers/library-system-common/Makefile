.PHONY: build-LibrarySystemCommonLayer

build-LibrarySystemCommonLayer:
		npm install
		npm run build
		mkdir -p "$(ARTIFACTS_DIR)/nodejs/node_modules"
		cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
		npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
		rm "$(ARTIFACTS_DIR)/nodejs/package.json"
		cp -r library-system-common "$(ARTIFACTS_DIR)/nodejs/node_modules"
