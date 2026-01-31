# Stage 1: Build Aplikasi Go
FROM golang:1.25.5-alpine AS builder

WORKDIR /app

# Copy file dependency dulu (biar cache-nya awet)
COPY go.mod go.sum ./
RUN go mod download

# Copy sisa source code
COPY . .

# Build binary aplikasi
# Perhatikan path cmd/api/main.go sesuai struktur projectmu
RUN go build -o main ./cmd/api/main.go

# Stage 2: Jalankan Aplikasi (Image lebih kecil)
FROM alpine:latest

WORKDIR /root/

# Copy binary dari stage builder
COPY --from=builder /app/main .

# PENTING: Copy service-account.json ke dalam container
# (Pastikan file ini ada di folder backend saat build)
COPY service-account.json . 
COPY .env .

# Expose port (Cloud Run biasanya pakai 8080)
EXPOSE 8080

# Jalankan aplikasi
CMD ["./main"]
