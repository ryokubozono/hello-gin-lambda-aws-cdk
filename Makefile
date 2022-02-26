.PHONY: build
build:
	GOOS=linux GOARCH=amd64
	cd functions && go build -a -o ./gin-server/main ./gin-server/main.go