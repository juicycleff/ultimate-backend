.DEFAULT_GOAL := all
BUILD_DIR ?= build
TEST_CONFIG ?= $(PWD)/config/bootstrap.test.yml

# Depend on all source files
GO_SOURCE_FILES = $(shell find $(PWD) -type f -name "*.go")

# Binaries
$(BUILD_DIR)/auditlog: $(GO_SOURCE_FILES)
	go build -o $(BUILD_DIR)/auditlog github.com/sanity-io/audit-log/cmd/auditlog

$(BUILD_DIR)/auditreporter: $(GO_SOURCE_FILES)
	go build -o $(BUILD_DIR)/auditreporter github.com/sanity-io/audit-log/cmd/auditreporter

$(BUILD_DIR)/auditsubscriber: $(GO_SOURCE_FILES)
	go build -o $(BUILD_DIR)/auditsubscriber github.com/sanity-io/audit-log/cmd/auditsubscriber

.PHONY:all
all: build

# Phony targets
.PHONY: build
build: \
	$(BUILD_DIR)/auditlog \
	$(BUILD_DIR)/auditreporter \
	$(BUILD_DIR)/auditsubscriber

.PHONY: clean
clean:
	rm -rf build

# local development only
.PHONY: start
setup:
	sh tools/prepare-local-dev.sh

# local development only
.PHONY: start
start:
	sh tools/start-service.sh

.PHONY: clean-all
clean-all:
	rm -rf build
	rm -rf data-db
	rm -rf data-pubsub

# Add more linters
.PHONY: lint
lint:
	golangci-lint run \
		--concurrency=2 \
		--deadline=600s \
		--tests=false \
		--disable-all \
		--enable=deadcode \
		--enable=errcheck \
		--enable=golint \
		--enable=goconst \
		--enable=govet \
		--enable=ineffassign \
		--enable=megacheck \
		--enable=structcheck \
		--enable=varcheck \
		--enable=unconvert \
		--exclude-use-default \
		--skip-dirs=mocks

.PHONY: test
test: export PUBSUB_EMULATOR_HOST=localhost:8085
test:
	TEST_CONFIG=$(TEST_CONFIG) \
	PUBSUB_EMULATOR_HOST=$(PUBSUB_EMULATOR_HOST) \
	go test -parallel 1 -p 1 ./...

.PHONY: test-ci
test-ci:
	@mkdir -p /tmp/artifacts /tmp/workspace
	TEST_CONFIG=$(TEST_CONFIG) \
	gotestsum --junitfile /tmp/artifacts/gotestsum-report.xml -- \
		-p 4 \
		-cover -coverprofile /tmp/workspace/cover-${CIRCLE_NODE_INDEX}.out \
		-test.short -test.timeout=30m \
		./...

.PHONY: cover-ci
cover-ci:
	gocovmerge $(find /tmp/workspace -type f -name "cover*.out") > cover.out
	go tool cover -html=cover.out -o /tmp/workspace/coverage.html
	go tool cover -func cover.out | grep total | awk '{print $3}' > /tmp/workspace/total-coverage.txt

#$(circleci tests glob "**/*.go" | circleci tests split)
