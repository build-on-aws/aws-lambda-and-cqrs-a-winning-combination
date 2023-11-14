.PHONY: build-LayerCommons

build-LayerCommons:
		npm install
		npm run build
		mkdir -p "$(ARTIFACTS_DIR)/nodejs/node_modules"
		cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
		npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
		rm "$(ARTIFACTS_DIR)/nodejs/package.json"
		cp -r commons "$(ARTIFACTS_DIR)/nodejs/node_modules"
