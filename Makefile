.PHONY: install
install:
	cd tools; $(MAKE) install
	./tools/generate_types_from_schema/generate.sh
	cd ts; $(MAKE) install
	cd py; $(MAKE) install

.PHONY: dev
dev:
	cd ts; $(MAKE) dev
	cd py; $(MAKE) dev

.PHONY: test
test:
	cd ts; $(MAKE) test
	cd py; $(MAKE) test

.PHONY: build
build:
	cd ts; $(MAKE) build
	cd py; $(MAKE) build

.PHONY: clean
clean:
	cd ts; $(MAKE) clean
	cd py; $(MAKE) clean

